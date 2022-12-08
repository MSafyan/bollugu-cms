/*
    Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Stack, InputLabel, TextField, Typography } from '@material-ui/core';
import Dialog from 'src/components/misc/alerts/Dialog';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import ServerError from 'src/components/misc/alerts/ServerError';
import { AddSectionSchema } from 'src/config/form-schemas';
import { MadrisaContext } from '../context/MadrisaContext';
import sectionService from 'src/services/SectionService';
import { ThemeProvider } from '@material-ui/core/styles';


/*
        Main Working
*/
export default () => {

    const [openDia, setOpenDia] = React.useState(false);
    const { madrisa, reload } = useContext(MadrisaContext);
    const [serverError, setServerError] = useState('');

    const batch = madrisa.batch;

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            numberSections: 0,
        },

        validationSchema: AddSectionSchema,

        onSubmit: (_values) => {
            setSubmitting(true);
            addData();
        }
    });


    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldError } = formik;

    const addData = async () => {
        if (values.numberSections < (26 - batch.sections.length)) {
            for (let i = 0; i < values.numberSections; i++) {
                try {
                    await sectionService.addSection(batch.id);
                    setOpenDia(true);
                } catch (_error) {
                    setServerError('Something went wrong');
                    setSubmitting(false);
                }
            }
        }
        else {
            setFieldError("numberSections", "Not more than " + (26 - batch.sections.length) + " sections can be added");
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setOpenDia(false);
        reload();
        navigate("..");
    };

    return (
        <FormikProvider value={formik}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

            </Stack>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel label="Address">Number of sections</InputLabel>
                            </ThemeProvider>
                            <TextField
                                fullWidth
                                {...getFieldProps('numberSections')}
                                error={Boolean(touched.numberSections && errors.numberSections)}
                                helperText={touched.numberSections && errors.numberSections}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>


                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    Section is added
                </Dialog >
                <LoadingFormButton disabled={batch.blocked} loading={isSubmitting}>
                    Add
                </LoadingFormButton>
                <ServerError open={serverError}>
                    {serverError}
                </ServerError>
            </Form>
        </FormikProvider >
    );
};



