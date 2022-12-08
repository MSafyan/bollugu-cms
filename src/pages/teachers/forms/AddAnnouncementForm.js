/*
    Imports
*/
import { Grid, InputLabel, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import ServerError from 'src/components/misc/alerts/ServerError';
import { AddAnnouncementSchema } from 'src/config/form-schemas';
import announcementService from 'src/services/AnnoucementService';
import notificationService from 'src/services/NotificationService';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { ClassContext } from '../context/ClassContext';

/*
    Main Working
*/
export default ({ classes }) => {

    const [serverError, setServerError] = useState('');
    const [openDia, setOpenDia] = React.useState(false);
    const reload = useContext(ClassContext).reload;


    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            details: '',
        },

        validationSchema: AddAnnouncementSchema,

        onSubmit: () => {
            setSubmitting(true);
            addData();
        }
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

    const addData = () => {
        announcementService.add(values.details, classes.id)
            .then((data) => {
                const aID = data.data.id;
                notificationService.addClassAnn(classes.id, aID, `${classes.teacher.name}`, `made a new annoucement.`, `/student/${classes.name}/announcements`);
                setOpenDia(true);
            })
            .catch((_err) => {
                //TODO: Error handling here @aeman-fatima
                setServerError('Something went here');
            });
    };


    const handleClose = () => {
        reload();
        setOpenDia(false);
        navigate("../");
    };

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <ContentStyle>
                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel>Description</InputLabel>
                            </ThemeProvider>
                            <TextField
                                multiline
                                rows={5}
                                fullWidth
                                {...getFieldProps('details')}
                                error={Boolean(touched.details && errors.details)}
                                helperText={touched.details && errors.details}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>
                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    Announcement is added
                </Dialog >
                <LoadingFormButton loading={isSubmitting}>
                    Add
                </LoadingFormButton>
                {(serverError || touched.file && errors.file) &&
                    <ServerError>
                        {serverError || touched.file && errors.file}
                    </ServerError>
                }
                <ServerError open={serverError || touched.file && errors.file}>
                    {serverError || touched.file && errors.file}
                </ServerError>
            </Form>
        </FormikProvider >
    );
};


