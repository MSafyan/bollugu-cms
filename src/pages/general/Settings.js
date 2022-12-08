/*
    Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Page from 'src/components/Page';
import otherService from 'src/services/OtherService';
import userService from 'src/services/UserService';
import Form from './forms/SettingsForm';

/*
    Main Working
*/
export default () => {

    const [cities, setCities] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);


    function getData() {
        userService
            .getLoggedInUser()
            .then((user) => {
                setLoggedInUser(user);
            })
            .catch(() => {
                navigate('/404');
            });
    }

    function getCities() {
        otherService
            .getCities(0, 400)
            .then((data) => {
                setCities(data);
            })
            .catch(() => {
                console.error('Error in getting cities');
            });
    }

    useEffect(() => {
        getCities();
        getData();
    }, []);

    return (
        <Page title='Settings'>
            <Container maxWidth="xl">
                {loggedInUser &&
                    <Form cities={cities} loggedInUser={loggedInUser} />
                }
            </Container>
        </Page>
    );
};

