/*
    Imports:
        External Libraries
*/
import { useEffect, useState } from 'react';
/*
    Imports:
        Material UI
*/

import { Container } from '@material-ui/core';
import Form from './forms/AddFeeForm';
import Page from 'src/components/Page';
import madrisaService from 'src/services/MadrisaService';

/*
    Main Working
*/
export default () => {

    const [madaris, setMadaris] = useState(null);

    function getMadaris() {
        madrisaService
            .getAll(0, 400)
            .then((data) => {
                const newData = data.filter((m) => m.batches.length > 0);
                setMadaris(newData);
            })
            .catch(() => {
                console.error('Error in getting Madaris');
            });
    }

    useEffect(() => {
        getMadaris();
    }, []);

    return (
        <Page title='Add Fee'>
            <Container maxWidth="xl">
                {madaris && <Form madaris={madaris} />}
            </Container>
        </Page>
    );
};

