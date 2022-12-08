/*
    Imports
*/
import { Box, Button, CircularProgress, Grid, InputLabel, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DatePicker from '@material-ui/lab/DatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import TimePicker from '@material-ui/lab/TimePicker';
import NumberFormat from 'react-number-format';
import Dialog from 'src/components/misc/alerts/Dialog';
import ServerError from 'src/components/misc/alerts/ServerError';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { AddAssignmentSchema } from 'src/config/form-schemas';
import { acceptFileUpload, DefaultUploadedFileImage, hideFileAlertIn } from 'src/config/settings';
import assignmentService from 'src/services/AssignmentService';
import notificationService from 'src/services/NotificationService';
import { joinDateTime } from 'src/utils/dateTime';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { ClassContext } from '../context/ClassContext';

/*
    Main Working
*/
export default ({ classes, editing }) => {

    const [serverError, setServerError] = useState('');
    const [openDia, setOpenDia] = useState(false);
    const [openDiaWar, setOpenDiaWar] = useState(false);
    const [openWarDate, setOpenWarDate] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [toEditEndDate, setToEditEndDate] = useState(null);
    const [toEditStartDate, setToEditStartDate] = useState(null);
    const [wrongFile, setWrongFile] = useState(false);


    const assignmentID = useParams().assignmentID;
    const currentClass = useContext(ClassContext).c;
    const reload = useContext(ClassContext).reload;

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            startDate: new Date(),
            startTime: new Date().getTime(),
            endDate: new Date().setDate(new Date().getDate() + 1),
            endTime: new Date().getTime(),
            file: '',
            topic: '',
            marks: 0,
            details: ''
        },

        validationSchema: AddAssignmentSchema,

        onSubmit: () => {
            setSubmitting(true);
            addData();
        }
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting, setFieldError } = formik;

    const addData = () => {

        let FunctionToCall = assignmentService.add;
        if (assignmentID)
            FunctionToCall = assignmentService.update;

        let start = joinDateTime(values.startDate, values.startTime);
        let end = joinDateTime(values.endDate, values.endTime);

        if (values.file == '' && values.details == '') {
            setOpenDiaWar(true);
            setSubmitting(false);
            return;
        }

        if (end < start) {
            setOpenWarDate(true);
            setSubmitting(false);
            return;
        }

        FunctionToCall(classes.id, start, end, values.file == '' ? null : values.file, values.topic, values.marks, values.details, assignmentID)
            .then((assignment) => {
                const aID = assignment.data.id;
                const hourBehind = (new Date(end)).setHours(end.getHours() - 1);
                const currentTime = new Date().getTime();
                const startTime = new Date(start).getTime();
                if (editing) {
                    notificationService.getAssignment(aID)
                        .then((notifications) => {
                            notifications.forEach((notifcation) => notificationService.remove(notifcation.id));
                        });
                    if (startTime > currentTime)
                        notificationService.addClassAssignment(classes.id, aID, `${classes.teacher.name}`, `has uploaded new assignment`, `/student/${classes.name}/assignments`, start);
                    else
                        notificationService.addClassAssignment(classes.id, aID, `${classes.teacher.name}`, `has updated assignment ${values.topic}`, `/student/${classes.name}/assignments`);
                    if (hourBehind > currentTime && hourBehind > startTime)
                        notificationService.addClassAssignment(classes.id, aID, `Assignment ${values.topic}`, `has only 1 hour left before submission closes.`, `/student/${classes.name}/assignments`, hourBehind);
                    notificationService.addTeacherAssign(classes.teacher.id, aID, `Assignment ${values.topic}`, `is closed now.`, `/teacher/${classes.name}/assignments/${aID}`, end);
                    setOpenDia(true);
                    return;
                }

                notificationService.addClassAssignment(classes.id, aID, `${classes.teacher.name}`, `has uploaded new assignment`, `/student/${classes.name}/assignments`, start);
                if (hourBehind > currentTime && hourBehind > startTime)
                    notificationService.addClassAssignment(classes.id, aID, `Assignment ${values.topic}`, `has only 1 hour left before submission closes.`, `/student/${classes.name}/assignments`, hourBehind);
                notificationService.addTeacherAssign(classes.teacher.id, aID, `Assignment ${values.topic}`, `is closed now.`, `/teacher/${classes.name}/assignments/${aID}`, end);
                setOpenDia(true);
            })
            .catch((_err) => {
                //TODO: Error handling imrpovements
                setServerError('Something went wrong');
            }).finally();
    };

    const handleEditing = () => {
        if (editing) {
            const data = currentClass.assignments.find((a) => a.id == assignmentID);
            if (data) {
                new Date(data.end) > values.endDate ? setToEditEndDate(new Date) : setToEditEndDate(new Date(data.end));
                new Date(data.start) > values.startDate ? setToEditStartDate(new Date) : setToEditStartDate(new Date(data.start));
                setFieldValue('startDate', data.start);
                setFieldValue('startTime', data.start);
                setFieldValue('endDate', data.end);
                setFieldValue('endTime', data.end);
                setFieldValue('topic', data.topic);
                setFieldValue('details', data.details);
                setFieldValue('marks', data.marks);
                setFieldValue('file', data.file?.id);
                setFieldValue('details', data.description);
            }
            else {
                navigate('/404');
            }
        }
    };

    const handleClose = () => {
        reload();
        setOpenDia(false);
        navigate("../");
    };
    const handleCloseWar = () => {
        setOpenDiaWar(false);
        setOpenWarDate(false);
    };

    const handleImageChange = () => {
        setWrongFile(false);
        if (selectedImage) {
            assignmentService.upload(selectedImage, values.topic, null)
                .then((response) => {
                    setFieldValue('file', response.data[0].id);
                })
                .catch((err) => {
                    setFieldError('file', 'Something went wrong');
                    if (err.fileUploadError) {
                        setSelectedImage();
                        setWrongFile(err.msg);
                        setTimeout(() => setWrongFile(false), hideFileAlertIn);
                    }
                });
        }
    };

    useEffect(handleEditing, []);
    useEffect(handleImageChange, [selectedImage]);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>


                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Start Date
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={values.startDate}
                                    minDate={editing ? toEditStartDate : new Date()}
                                    onChange={(newValue) => {
                                        setFieldValue('startDate', newValue);
                                    }}
                                    renderInput={(params) => <TextField
                                        fullWidth
                                        {...params}
                                        {...getFieldProps('startDate')}

                                        error={Boolean(touched.startDate && errors.startDate)}
                                        helperText={touched.startDate && errors.startDate}
                                    />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Start Time
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    value={values.startTime}
                                    views={["hours", "minutes"]}
                                    format="hh:mm"
                                    onChange={(newValue) => {
                                        setFieldValue('startTime', newValue);
                                    }}
                                    renderInput={(params) => <TextField
                                        fullWidth
                                        {...params}
                                        {...getFieldProps('startTime')}

                                        error={Boolean(touched.startTime && errors.startTime)}
                                        helperText={touched.startTime && errors.startTime}
                                    />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </ContentStyle>

                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                End Date
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={values.endDate}
                                    minDate={editing ? toEditEndDate : new Date()}
                                    onChange={(newValue) => {
                                        setFieldValue('endDate', newValue);
                                    }}
                                    renderInput={(params) => <TextField
                                        fullWidth
                                        {...params}
                                        {...getFieldProps('endDate')}

                                        error={Boolean(touched.endDate && errors.endDate)}
                                        helperText={touched.endDate && errors.endDate}
                                    />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                End Time
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    value={values.endTime}
                                    onChange={(newValue) => {
                                        setFieldValue('endTime', newValue);
                                    }}
                                    renderInput={(params) => <TextField
                                        fullWidth
                                        {...params}
                                        {...getFieldProps('endTime')}

                                        error={Boolean(touched.endTime && errors.endTime)}
                                        helperText={touched.endTime && errors.endTime}
                                    />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </ContentStyle>

                <ContentStyle>
                    <Typography variant="h6" marginTop={4}>
                        Upload File
                    </Typography>
                    <ContentStyle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <input
                                    disabled={values.topic.length < 1}
                                    accept={acceptFileUpload}
                                    type="file"
                                    id="select-image"
                                    style={{ display: 'none' }}
                                    onChange={e => setSelectedImage(e.target.files[0])}
                                />
                                <label htmlFor="select-image">
                                    <Button
                                        disabled={values.topic.length < 1}
                                        variant="outlined" color='primary' component="span"
                                    // error={Boolean(touched.file && errors.file)}
                                    // helperText={touched.file && errors.file}
                                    >

                                        Upload File
                                    </Button>

                                </label>
                                {(selectedImage) ? (
                                    <Box mt={2} textAlign="center">
                                        {values.file ? <img src={DefaultUploadedFileImage} alt={"Uploaded"} height="100px" /> : <CircularProgress color="primary" />}
                                    </Box>
                                ) :

                                    (editing && values.file) && (
                                        <Box mt={2} textAlign="center">
                                            <img src={DefaultUploadedFileImage} alt={"Uploaded"} height="100px" />
                                        </Box>
                                    )}

                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel>Title</InputLabel>
                                </ThemeProvider>
                                <TextField
                                    fullWidth
                                    {...getFieldProps('topic')}
                                    error={Boolean(touched.topic && errors.topic)}
                                    helperText={touched.topic && errors.topic}
                                />
                            </Grid>
                        </Grid>
                    </ContentStyle>
                    <ContentStyle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel label="totalMarks">Total Marks</InputLabel>
                                </ThemeProvider>
                                <NumberFormat
                                    fullWidth
                                    customInput={TextField}
                                    {...getFieldProps('marks')}
                                    error={Boolean(touched.marks && errors.marks)}
                                    helperText={touched.marks && errors.marks}
                                />
                            </Grid>
                        </Grid>
                    </ContentStyle>
                    <ContentStyle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel label="Description">Description</InputLabel>
                                </ThemeProvider>
                                <TextField
                                    multiline
                                    rows={4}
                                    fullWidth
                                    {...getFieldProps('details')}
                                    error={Boolean(touched.details && errors.details)}
                                    helperText={touched.details && errors.details}
                                />
                            </Grid>
                        </Grid>
                    </ContentStyle>
                </ContentStyle>



                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    Assignment is {editing ? 'updated' : 'added'}
                </Dialog >
                <Dialog
                    buttonText={"Close"}
                    openDialog={openDiaWar}
                    handleButton={handleCloseWar}
                    warning={true}
                >
                    Please enter deatils or file
                </Dialog >
                <Dialog
                    buttonText={"Close"}
                    openDialog={openWarDate}
                    handleButton={handleCloseWar}
                    warning={true}
                >
                    An assignment cannot end before it starts.
                </Dialog >
                <AlertSnackbar severity="warning" open={!!wrongFile}>
                    {wrongFile}
                </AlertSnackbar>
                <LoadingFormButton loading={isSubmitting}>
                    {editing ? 'Save' : 'Add'}
                </LoadingFormButton>
                <ServerError open={serverError || touched.file && errors.file}>
                    {serverError || touched.file && errors.file}
                </ServerError>
            </Form>
        </FormikProvider >
    );
};


