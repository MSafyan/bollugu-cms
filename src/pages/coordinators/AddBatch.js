/*
    Imports
*/
import { Container } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from 'src/components/Page';
import { MadrisaContext } from './context/MadrisaContext';
import Form from './forms/AddBatchForm';

/*
    Main Working
*/
export default () => {

    const navigate = useNavigate();
    const { madrisa, reload } = useContext(MadrisaContext);

    useEffect(() => {
        if (madrisa.blocked)
            return navigate("..");
    }, []);

    /*
      Main Design
    */
    return (
        <Page title="Add Batch">
            <Container maxWidth="xl">
                <ListPageTitle>
                    Add Batch
                </ListPageTitle>
                <Form madrisa={madrisa} reload={reload} />
            </Container>
        </Page >
    );
};
