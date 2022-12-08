/*
    Imports
*/
import { Container } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from 'src/components/Page';
import otherService from '../../services/OtherService';
import { MadrisaContext } from './context/MadrisaContext';
import Form from './forms/AddStudentForm';

/*
    Main Working
*/
export default ({ editing }) => {
    /*
      States, Params, Navigation, Query, Variables.
    */
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const { madrisa, reload } = useContext(MadrisaContext);

    const navigate = useNavigate();

    const displayText = editing ? 'Edit' : 'Add';
    const pageName = displayText + ' Student';
    /*
      Handlers, Functions
    */


    function getCities() {
        setLoading(true);
        otherService
            .getCities(0, 400)
            .then((data) => {
                setCities(data);
            })
            .catch((_err) => {
                console.error('Error in getting cities');
            })
            .finally(() => {
                setLoading(false);
            });
    }
    /*
      Use Effect Hooks.
    */
    useEffect(() => {
        if (madrisa.blocked)
            return navigate("..");
        getCities();
    }, []);

    /*
      Main Design
    */
    return (
        <Page title={pageName} >
            <Container maxWidth="xl">
                {
                    loading ?
                        <CenterLoading />
                        :
                        <>
                            <ListPageTitle>
                                {pageName}
                            </ListPageTitle>
                            <Form cities={cities} sections={madrisa.batch.sections} editing={editing} reload={reload} />
                        </>
                }

            </Container>
        </Page >
    );
};

