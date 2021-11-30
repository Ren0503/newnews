import React, { useEffect, useState } from 'react';
import { createCollection, createStory, listCollectionsUser } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { Message, Loader } from 'components/shared';
import { MainLayout } from 'layouts';
import { RouteComponentProps } from 'react-router-dom';
import { AppDispatch } from 'store';
import { ReduxState } from 'types/ReduxState';
import { Story } from 'components/stories';
import {
    Form,
    Button,
    Row,
    Col,
    Image,
    OverlayTrigger,
    Tooltip,
    Card
} from 'react-bootstrap';

interface DashboardScreenProps extends RouteComponentProps { }

const DashboardScreen = ({ history }: DashboardScreenProps) => {
    const [nameCol, setNameCol] = useState<string>('');

    const [name, setName] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');

    const dispatch = useDispatch<AppDispatch>();

    const userLogin = useSelector((state: ReduxState) => state.userLogin);
    const { userInfo } = userLogin;

    const collectionUser = useSelector((state: ReduxState) => state.collectionUser);
    const { collections, loading, error } = collectionUser;

    const storyCreate = useSelector((state: ReduxState) => state.storyCreate);
    const {
        success: successCreate,
        story: createdStory,
        loading: loadingCreate,
        error: errorCreate
    } = storyCreate;

    const collectionCreate = useSelector((state: ReduxState) => state.collectionCreate);
    const {
        success: successCollection,
        collection: createdCollection,
        loading: loadingCollection,
        error: errorCollection,
    } = collectionCreate;

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        } else {
            if (successCreate && createdStory)
                history.push(`/story/${createdStory._id}/edit`);
            if (successCollection && createdCollection)
                history.push(`/dashboard`)

            dispatch(listCollectionsUser());
            setName(userInfo.name);
            setAvatar(userInfo.avatar);
        }
    }, [
        dispatch,
        history,
        userInfo,
        successCreate,
        createdStory,
        successCollection,
        createdCollection,
    ]);

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createCollection(nameCol));
    };

    const createStoryHandler = () => {
        dispatch(createStory());
    };

    const dashboardDisplay = () => {
        if (loading || loadingCreate || loadingCollection)
            return <Loader />
        else if (error)
            return <Message variant='danger'>{error}</Message>
        else if (errorCreate)
            return <Message variant='danger'>{errorCreate}</Message>
        else if (errorCollection)
            return <Message variant='danger'>{errorCollection}</Message>
        else
            return (
                <>
                    <div className="author-bg">
                        <div className="author">
                            <Image className="ml-3" src={avatar} width="170" alt="Avatar" roundedCircle />
                            <h5>{name}</h5>
                        </div>
                    </div>

                    <Form onSubmit={submitHandler}>
                        <Form.Control
                            type='text'
                            name='nameCol'
                            value={nameCol}
                            onChange={(e) => setNameCol(e.target.value)}
                            placeholder='Create collection...'
                            className='mr-sm-2 ml-sm-5'
                        ></Form.Control>
                        <Button type="submit">
                            <i className="fas fa-plus"></i>
                        </Button>
                    </Form>

                    {collections.map((collection) => (
                        <>
                            <h3>{collection.name}: {collection.numStories} stories </h3>
                            <Row>
                                {collection.stories.map((story) => (
                                    <Col key={story._id} sm={12} md={6} lg={3}>
                                        <Story story={story} />
                                    </Col>
                                ))}
                            </Row>
                        </>
                    ))}

                    <div className="create">
                        <OverlayTrigger
                            overlay={
                                <Tooltip>
                                    Create Story
                                </Tooltip>
                            }
                        >
                            <Button className="btn-create" onClick={createStoryHandler}>
                                <i className="fas fa-plus"></i>
                            </Button>
                        </OverlayTrigger>
                    </div>
                </>
            )
    }

    return (
        <MainLayout>
            {dashboardDisplay()}
        </MainLayout>
    );
};

export default DashboardScreen;