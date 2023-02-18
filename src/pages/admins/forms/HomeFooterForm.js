/*
	Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
	Imports:
		Material UI
*/
import { Grid, InputLabel, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
/*
	Imports:
		Our Imports
		Components and Settings
		Services
*/
import Dialog from 'src/components/misc/alerts/Dialog';
import ServerError from 'src/components/misc/alerts/ServerError';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { RouteHomeFooter } from 'src/config/routes';
import serviceService from 'src/services/HomeFooterServiceClass';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { HomeFooterSchema } from 'src/config/form-schemas';

/*
	Main Working
*/
export default ({ menuItem, editing }) => {
  /*
		States, Params, Navigation, Query, Variables.
	*/
  const [serverError, setServerError] = useState('');
  const [openDia, setOpenDia] = useState(false);

  const navigate = useNavigate();

  /*
		Form Setup
	*/
  const formik = useFormik({
    initialValues: {
      phoneNumber: menuItem?.phoneNumber ?? '',
      email: menuItem?.email ?? ''
    },
    validationSchema: HomeFooterSchema,
    onSubmit: (_values, { setFieldError }) => {
      setSubmitting(true);
      addData();
    }
  });

  const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setSubmitting } =
    formik;

  /*
		Handlers
	*/
  const addData = () => {
    let FunctionToCall = serviceService.add;
    if (editing) FunctionToCall = serviceService.update;

    const data = {
      ...values
    };

    FunctionToCall(data, menuItem?.id)
      .then((_menuItem) => {
        setOpenDia(true);
      })
      .catch((err) => {
        setServerError('An Error Occured');
        setSubmitting(false);
      })
      .finally();
  };

  const handleClose = () => {
    setOpenDia(false);
    navigate(RouteHomeFooter);
  };

  /*
		Use Effect Hooks.
	*/
  const title = 'Home Footer';
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          {title} Details
        </Typography>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item sm={6} md={3}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Phone Number</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="phoneNumber"
                {...getFieldProps('phoneNumber')}
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
            </Grid>
            <Grid item sm={6} md={3}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Email</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="email"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
          </Grid>
        </ContentStyle>

        <ContentStyle>
          <Grid container spacing={3}></Grid>
        </ContentStyle>

        <Dialog buttonText={'Close'} openDialog={openDia} handleButton={handleClose}>
          {editing ? `${title} updated` : `${title} is added`}
        </Dialog>

        <LoadingFormButton loading={isSubmitting}>{editing ? 'Save' : 'Add'}</LoadingFormButton>
        <ServerError open={serverError || !!errors.availability}>
          {serverError ? serverError : errors.availability}
        </ServerError>
      </Form>
    </FormikProvider>
  );
};
