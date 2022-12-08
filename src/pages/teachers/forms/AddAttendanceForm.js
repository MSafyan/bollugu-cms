/*
    Imports
*/
import { Grid, InputLabel, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DatePicker from '@material-ui/lab/DatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import TimePicker from '@material-ui/lab/TimePicker';
import Dialog from 'src/components/misc/alerts/Dialog';
import ServerError from 'src/components/misc/alerts/ServerError';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { AddAttendanceSchema } from 'src/config/form-schemas';
import attendanceService from 'src/services/AttendanceService';
import notificationService from 'src/services/NotificationService';
import { getDateTime, joinDateTime } from 'src/utils/dateTime';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { ClassContext } from '../context/ClassContext';
import AddAttendanceTable from './tables/AddAttendanceTable';
/*
    Main Working
*/
export default ({ classes, editing }) => {

    const [serverError, setServerError] = useState('');
    const [openDia, setOpenDia] = React.useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [editingData, setEditingData] = useState();
    const [openWarDate, setOpenWarDate] = useState(false);

    const navigate = useNavigate();

    const attendanceID = useParams().attendanceID;

    const reload = useContext(ClassContext).reload;

    const childToParent = (dataFromTable) => {
        setAttendanceData(dataFromTable);
    };

    const formik = useFormik({
        initialValues: {
            startDate: new Date(),
            startTime: new Date().getTime(),
            endTime: new Date().getTime() + (60 * 60 * 1000),
            topic: '',
        },
        validationSchema: AddAttendanceSchema,

        onSubmit: () => {
            setSubmitting(true);
            addData();
        }
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting } = formik;

    const addData = () => {
        let start = joinDateTime(values.startDate, values.startTime);
        let end = joinDateTime(values.startDate, values.endTime);

        if (end < start) {
            setOpenWarDate(true);
            setSubmitting(false);
            return;
        }

        let FunctionToCall = attendanceService.addAttendance;
        if (attendanceID)
            FunctionToCall = attendanceService.update;

        FunctionToCall(classes.id, start, end, values.topic, attendanceData, attendanceID)
            .then(() => {
                if (editing) {
                    notificationService.addClass(classes.id, `${classes.teacher.name}`, `updated attendance (${getDateTime(start)}) for class ${classes.name}.`, `/student/${classes.name}/attendance`);
                }
                else {
                    notificationService.addClass(classes.id, `${classes.teacher.name}`, `uploaded attendance (${getDateTime(start)}) for class ${classes.name}.`, `/student/${classes.name}/attendance`);
                }
                setOpenDia(true);
            })
            .catch((_err) => {
                //TODO: improve error handling
                setServerError('Something went wrong');
            }).finally();
    };

    const handleediting = () => {
        if (editing) {
            const data = classes.attendance.find(o => o.id == attendanceID);
            const stuData = data.students.map(o => o.id);
            setFieldValue('topic', data.topic);
            setFieldValue('startDate', data.start);
            setFieldValue('startTime', data.start);
            setFieldValue('endTime', data.end);
            setEditingData(stuData);
        }
    };

    const handleClose = () => {
        setOpenDia(false);
        reload();
        navigate("../");
    };

    const handleCloseWar = () => {
        setOpenWarDate(false);
    };

    useEffect(handleediting, []);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Date
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={values.startDate}
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
                    </Grid>
                </ContentStyle>

                <ContentStyle>
                    <Grid container spacing={3}>
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
                                        setFieldValue('endTime', newValue.getTime() + (60 * 60 * 1000));
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
                    <Grid container spacing={3}>
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
                {(!editingData && !editing) &&
                    <ContentStyle>
                        <AddAttendanceTable studentData={classes.students} childToParent={childToParent} />
                    </ContentStyle>
                }

                {(editingData) &&
                    <ContentStyle>
                        <AddAttendanceTable studentData={classes.students} childToParent={childToParent} editingData={editingData} />
                    </ContentStyle>
                }

                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    Attendance is {editing ? 'updated' : 'added'}
                </Dialog >

                <Dialog
                    buttonText={"Close"}
                    openDialog={openWarDate}
                    handleButton={handleCloseWar}
                    warning={true}
                >
                    Lecture cannot end before it starts.
                </Dialog >

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



