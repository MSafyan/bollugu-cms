/*
    Imports
*/
import { Grid, TextField, Typography } from '@material-ui/core';
import { Form, FormikProvider, useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import NumberFormat from 'react-number-format';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import ServerError from 'src/components/misc/alerts/ServerError';
import classService from 'src/services/ClassService';
import notificationService from 'src/services/NotificationService';
import { ContentStyle } from '../../../theme/form-pages';
import { ClassContext } from '../context/ClassContext';

/*
    Main Working
*/
export default ({ past }) => {

    const [serverError, setServerError] = useState('');
    const [openDia, setOpenDia] = useState(false);
    const [openDiaWar, setOpenDiaWar] = useState(false);

    const currentClass = useContext(ClassContext).c;
    const reload = useContext(ClassContext).reload;

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            testWeightage: currentClass.testWeightage,
            assignmentWeightage: currentClass.assignmentWeightage,
            midsWeightage: currentClass.midsWeightage,
            finalWeightage: currentClass.finalWeightage,
            attendanceWeightage: currentClass.attendanceWeightage,
            attendancePercentage: currentClass.attendancePercentage,
        },
        onSubmit: () => {
            setSubmitting(true);
            addData();
        }
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting } = formik;

    const addData = () => {
        if ((values.totalWeightage) == 100)
            classService.addGradingSystem(values.testWeightage, values.assignmentWeightage, values.midsWeightage, values.finalWeightage, values.attendanceWeightage, values.attendancePercentage, currentClass.id)
                .then(() => {
                    notificationService.addClass(currentClass.id, `${currentClass.teacher.name}`, `has updated grading system for ${currentClass.name}.`, `/student/${currentClass.name}/gradingsystem`);
                    setOpenDia(true);
                })
                .catch((_err) => {
                    //TODO: error handling here
                    setServerError('Something went wrong');
                }).finally();

        else { setOpenDiaWar(true); setSubmitting(false); }


    };

    const countTotalWeightage = () => {
        setFieldValue('totalWeightage', (Number(values.testWeightage) + Number(values.assignmentWeightage) + Number(values.attendanceWeightage) + Number(values.midsWeightage) + Number(values.finalWeightage)));
    };

    const handleClose = () => {
        reload();
        setOpenDia(false);
        navigate("../");
    };
    const handleCloseWar = () => {
        setOpenDiaWar(false);
    };

    useEffect(countTotalWeightage, [values.testWeightage, values.assignmentWeightage, values.midsWeightage, values.finalWeightage, values.attendanceWeightage]);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <ContentStyle>
                    <Typography variant="h4" marginTop={4}>
                        Attendance
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Should be higher than:
                            </Typography>
                            <NumberFormat
                                fullWidth
                                disabled={past}
                                customInput={TextField}
                                type="input"
                                allowEmptyFormatting="true"
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                {...getFieldProps('attendancePercentage')}
                                error={Boolean(touched.attendancePercentage && errors.attendancePercentage)}
                                helperText={touched.attendancePercentage && errors.attendancePercentage}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Weightage:
                            </Typography>
                            <NumberFormat
                                fullWidth
                                disabled={past}
                                customInput={TextField}
                                type="input"
                                allowEmptyFormatting="true"
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                {...getFieldProps('attendanceWeightage')}
                                error={Boolean(touched.attendanceWeightage && errors.attendanceWeightage)}
                                helperText={touched.attendanceWeightage && errors.attendanceWeightage}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>

                <ContentStyle>
                    <Typography variant="h4" marginTop={4}>
                        Marks Destribution
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Test Weightage
                            </Typography>
                            <NumberFormat
                                fullWidth
                                disabled={past}
                                customInput={TextField}
                                type="input"
                                allowEmptyFormatting="true"
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                {...getFieldProps('testWeightage')}
                                error={Boolean(touched.testWeightage && errors.testWeightage)}
                                helperText={touched.testWeightage && errors.testWeightage}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Assignment Weightage:
                            </Typography>
                            <NumberFormat
                                fullWidth
                                disabled={past}
                                customInput={TextField}
                                type="input"
                                allowEmptyFormatting="true"
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                {...getFieldProps('assignmentWeightage')}
                                error={Boolean(touched.assignmentWeightage && errors.assignmentWeightage)}
                                helperText={touched.assignmentWeightage && errors.assignmentWeightage}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>

                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Mids Weightage
                            </Typography>
                            <NumberFormat
                                fullWidth
                                disabled={past}
                                customInput={TextField}
                                type="input"
                                allowEmptyFormatting="true"
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                {...getFieldProps('midsWeightage')}
                                error={Boolean(touched.midsWeightage && errors.midsWeightage)}
                                helperText={touched.midsWeightage && errors.midsWeightage}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Final Weightage:
                            </Typography>
                            <NumberFormat
                                fullWidth
                                disabled={past}
                                customInput={TextField}
                                type="input"
                                allowEmptyFormatting="true"
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                {...getFieldProps('finalWeightage')}
                                error={Boolean(touched.finalWeightage && errors.finalWeightage)}
                                helperText={touched.finalWeightage && errors.finalWeightage}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>

                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" marginTop={4}>
                                Total Weightage
                            </Typography>
                            <NumberFormat
                                fullWidth
                                disabled={true}
                                customInput={TextField}
                                type="input"
                                allowEmptyFormatting="true"
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                {...getFieldProps('totalWeightage')}
                                error={Boolean(touched.totalWeightage && errors.totalWeightage)}
                                helperText={touched.totalWeightage && errors.totalWeightage}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>

                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    Grading Criteria is updated
                </Dialog >

                <Dialog
                    buttonText={"Close"}
                    openDialog={openDiaWar}
                    handleButton={handleCloseWar}
                    warning={true}
                >
                    Sum of Weightages should be 100
                </Dialog >

                <LoadingFormButton loading={isSubmitting} disabled={past}>
                    Save
                </LoadingFormButton>
                <ServerError open={serverError || touched.file && errors.file}>
                    {serverError || touched.file && errors.file}
                </ServerError>
            </Form>
        </FormikProvider >
    );
};


