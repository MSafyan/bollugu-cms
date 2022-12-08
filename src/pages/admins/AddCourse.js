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
import Form from './forms/AddCourseForm';
import Page from 'src/components/Page';
import courseService from 'src/services/CourseService';

/*
    Main Working
*/
export default ({ editing }) => {

    const [courses, setCourses] = useState(null);

    function getCourses() {
        courseService
            .getAll(0, 400)
            .then((data) => {
                setCourses(data);
            })
            .catch(() => {
                console.error('Error loading courses list');
            });
    }

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <Page title={`${editing ? 'Edit' : 'Add'} Course`} >
            <Container maxWidth="xl">
                <Form courses={courses} editing={editing} />
            </Container>
        </Page>
    );
};

