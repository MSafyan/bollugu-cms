/*
    Imports
*/
import { Container } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import Page from 'src/components/Page';
import courseService from 'src/services/CourseService';
import { MadrisaContext } from './context/MadrisaContext';
import Form from './forms/AddClassForm';

/*
    Main Working
*/
export default ({ editing }) => {

    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { madrisa, reload } = useContext(MadrisaContext);

    function getCourses() {
        setLoading(true);
        courseService
            .getAll(0, 400)
            .then((data) => {
                setCourses(data);
            })
            .catch((_err) => {
                //Error in getting coruses
            })
            .finally(() => {
                setLoading(false);
            });
    }
    useEffect(() => {
        if (madrisa.blocked)
            return navigate("..");
        getCourses();
    }, []);
    return (
        <Page title={`${editing ? 'Edit' : 'Add'} Class`} >
            <Container maxWidth="xl">
                {loading ? (
                    <CenterLoading />
                ) : (
                    <Form teachers={madrisa.teachers} sections={madrisa.batch.sections} courses={courses} batch={madrisa.batch} editing={editing} reload={reload} />
                )}
            </Container>
        </Page>
    );
};

