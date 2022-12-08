/*
    Imports
*/
import { Container } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import otherService from '../../services/OtherService';
import { RootStyle } from '../../theme/form-pages';
import { MadrisaContext } from './context/MadrisaContext';
import Form from './forms/AddTeacherform';

/*
    Main Working
*/
export default ({ editing }) => {
    /*
      States, Params, Navigation, Query, Variables.
    */
    const [cities, setCities] = useState(null);
    const navigate = useNavigate();

    const { madrisa, reload } = useContext(MadrisaContext);

    /*
      Handlers, Functions
    */

    function getCities() {
        otherService
            .getCities(0, 400)
            .then((data) => {
                setCities(data);
            })
            .catch((_err) => {
                console.error('Error in getting cities');
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
        <RootStyle title={`${editing ? 'Edit' : 'Add'} Teacher`} >

            <Container maxWidth="xl">
                <ListPageTitle>
                    {editing ? 'Edit' : 'Add'} Teacher
                </ListPageTitle>
                <Form cities={cities} editing={editing} reload={reload} />
            </Container>
        </RootStyle >
    );
};
