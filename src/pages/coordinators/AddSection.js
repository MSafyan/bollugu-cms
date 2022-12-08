/*
    Imports
*/
import { Container } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from 'src/components/Page';
import { MadrisaContext } from './context/MadrisaContext';
import Form from './forms/AddSectionsForm';

/*
    Main Working
*/
export default () => {

    const navigate = useNavigate();
    const { madrisa } = useContext(MadrisaContext);

    useEffect(() => {
        if (madrisa.blocked)
            return navigate("..");
    }, []);
    /*
      Main Design
    */
    return (
        <Page title="Add Section">
            <Container maxWidth="xl">
                <ListPageTitle>
                    Add Section
                </ListPageTitle>
                <Form />
            </Container>
        </Page >
    );
};
