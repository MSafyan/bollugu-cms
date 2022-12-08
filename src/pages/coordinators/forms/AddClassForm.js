/*
        Imports
*/
import { Alert, Collapse, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import classService from 'src/services/ClassService';
import notificationService from 'src/services/NotificationService';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { CoordinatorClassContext } from '../context/CoordinatiorClassContext';
import { MadrisaContext } from '../context/MadrisaContext';

/*
        Main Working
*/
export default ({ teachers, sections, courses, batch: batch_o, editing: edit_obj, reload: re_laod }) => {

    const [serverError, setServerError] = useState('');
    const [openDia, setOpenDia] = useState(false);
    const [openServerError, setOpenServerError] = useState(false);

    const classID = useParams().cID;
    const [batch, setBatch] = useState(batch_o);
    const [editing, setEditing] = useState(edit_obj || classID);

    const { madrisa } = useContext(MadrisaContext);
    let class_;
    if (classID) {
        class_ = useContext(CoordinatorClassContext).c;
    }

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            section: '',
            teacher: '',
            course: '',
        },

        onSubmit: () => {
            addData();
        }
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting } = formik;

    const courseCode = courses.find(c => c.id == values.course)?.code;

    function addData() {
        setSubmitting(true);

        let FunctionToCall = classService.addClass;
        let studentsIDs;
        let name = madrisa.code.concat('-', batch.year, '-', courseCode, '-', values.section.name);

        var errorMessage = '';
        if (!values.teacher)
            errorMessage = 'Please select teacher';
        if (!values.course)
            errorMessage = 'Please select course';
        if (!values.section)
            errorMessage = 'Please select section';
        if (editing) {
            FunctionToCall = classService.updateClass;
            name = values.name;
        }
        else
            if (errorMessage) {

                setServerError(errorMessage);
                setSubmitting(false);
                setOpenServerError(true);
                return;
            }
            else {
                const course = courses.find(c => c.id == values.course);
                if (course.prereq_id.length > 0) {
                    const filteredStudents = values.section.students.filter((student) => {
                        for (const pre of course.prereq_id) {
                            const foundClass = student.classes.find((c) => c.course?.id == pre);
                            if (!foundClass) {
                                return false;
                            }
                            else return (foundClass.blocked && foundClass.students.pass);
                        }
                    });
                    studentsIDs = filteredStudents.map(({ id }) => id);
                }
                else {
                    studentsIDs = values.section.students.map(({ id }) => id);
                }
            }



        FunctionToCall(name, batch.id, values.teacher, values.course, studentsIDs, values.class_id)
            .then(() => {
                const teacher = teachers.find((t) => t.id == values.teacher);
                const course = courses.find((c) => c.id == values.course);
                if (editing) {
                    if (class_.teacher.id != teacher) {
                        class_.students.forEach((s) => {
                            notificationService.addStudent(s.id, `${course.name}`, `will be taught by ${teacher.name} from now on.`, `/student/${name}`);
                        });
                        notificationService.addTeacher(teacher.id, `${course.name}`, `has been assigned to you.`, `/teacher/${name}`);
                        notificationService.addTeacher(class_.teacher.id, `${course.name}`, `class ${name} has been removed from you.`, ``);
                    }
                }
                else {
                    studentsIDs.forEach((s) => {
                        notificationService.addStudent(s, `${course.name}`, `by ${teacher.name} has been assigned to you.`, `/student/${name}`);
                    });
                    notificationService.addTeacher(teacher.id, `${course.name}`, `has been assigned to you.`, `/teacher/${name}`);
                }


                setOpenDia(true);
            })
            .catch((err) => {
                if (err.response.data.error.message == "This attribute must be unique") {
                    setServerError("Class " + name + " already exists");
                }
                else
                    setServerError('An Error Occured');
                setSubmitting(false);
                setOpenServerError(true);
            }).finally();

    }

    const handleEditing = () => {
        if (classID) {
            setFieldValue('teacher', class_.teacher.id);
            setFieldValue('course', class_.course.id);
            setFieldValue('class_id', class_.id);
            setFieldValue('name', class_.name);
            let section_obj = sections.find(o => o.name == (class_.name.slice(-1)));
            setFieldValue('section', section_obj);
            setBatch(class_.batch);
            if (class_.batch.blocked)
                setServerError("Can not edit past batch classes.");
            setEditing(true);
        }
        else {
            setEditing(false);
        }
    };

    const handleClose = () => {
        setOpenDia(false);
        if (editing) {
            navigate(`../../${values.name}`);
            return;
        }
        re_laod();
        const name = madrisa.code.concat('-', batch.year, '-', courseCode, '-', values.section.name);
        navigate(`../${name}`);
    };

    const handleCloseServerErr = (e) => {
        setOpenServerError(serverError.slice(14) == e.target?.name ? false : '');
    };

    useEffect(handleEditing, [classID]);

    return (
        <FormikProvider value={formik}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    {editing ? "Editing" : "Add"} Class - Batch {batch.year}
                </Typography>

            </Stack>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                {sections &&
                    <ContentStyle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel label="Sections">Section</InputLabel>
                                </ThemeProvider>
                                <Select fullWidth
                                    {...getFieldProps('section')}
                                    // multiple
                                    disabled={editing}
                                    error={Boolean(touched.section && errors.section)}
                                    helperText={touched.teacher && errors.teacher}
                                    onBlur={(e) => {
                                        handleCloseServerErr(e.target.value ? e : '');
                                    }}
                                >
                                    {
                                        sections.map(row => (
                                            <MenuItem key={row.id} value={row}>{`${row.name}`}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Grid>
                        </Grid>
                    </ContentStyle>}


                {courses &&
                    <ContentStyle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel label="Courses">Course</InputLabel>
                                </ThemeProvider>
                                <Select fullWidth
                                    {...getFieldProps('course')}
                                    disabled={editing}
                                    error={Boolean(touched.course && errors.course)}
                                    helperText={touched.teacher && errors.teacher}
                                    onBlur={(e) => {
                                        handleCloseServerErr(e.target.value ? e : '');
                                    }}
                                >
                                    {
                                        courses.map(row => (
                                            <MenuItem key={row.id} value={row.id}>{`${row.name} - ${row.code}`}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Grid>
                        </Grid>
                    </ContentStyle>}


                {teachers &&
                    <ContentStyle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel label="Teacher">Teacher</InputLabel>
                                </ThemeProvider>
                                <Select fullWidth
                                    {...getFieldProps('teacher')}
                                    // multiple
                                    error={Boolean(touched.teacher && errors.teacher)}
                                    helperText={touched.teacher && errors.teacher}
                                    onBlur={(e) => {
                                        handleCloseServerErr(e.target.value ? e : '');
                                    }}
                                >
                                    {
                                        teachers.map(row => (
                                            <MenuItem key={row.id} value={row.id}>{`${row.name} - ${row.username}`}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Grid>
                        </Grid>
                    </ContentStyle>}

                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    Class is {editing ? 'updated' : 'added'}
                </Dialog >
                <LoadingFormButton disabled={batch.blocked} loading={isSubmitting}>
                    {editing ? 'Save' : 'Add'}
                </LoadingFormButton>
                {serverError &&
                    <Stack sx={{ width: '50%' }} marginTop={3}>
                        <Collapse in={openServerError}>
                            <Alert severity="error">
                                {serverError}
                            </Alert>
                        </Collapse>
                    </Stack>
                }
            </Form>
        </FormikProvider >
    );
};



