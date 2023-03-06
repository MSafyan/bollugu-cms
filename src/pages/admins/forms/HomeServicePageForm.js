/*
	Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
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
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import Dialog from 'src/components/misc/alerts/Dialog';
import ServerError from 'src/components/misc/alerts/ServerError';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { AddServiceScheme } from 'src/config/form-schemas';
import { RoutehomeSectionsPage } from 'src/config/routes';
import serviceService from 'src/services/HomeSectionsServiceClass';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { SelectTemplateLayout, SelectYesNo } from './Selects';

/*
	Main Working
*/

const YesNoToBool = (value) => {
  if (value === 'Yes') return true;
  else return false;
};
const BoolToYesNo = (value) => {
  if (value) return 'Yes';
  else return 'No';
};

export default ({ menuItem, editing }) => {
  /*
		States, Params, Navigation, Query, Variables.
	*/
  const [serverError, setServerError] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const [wrongFile, setWrongFile] = useState(false);

  const navigate = useNavigate();

  /*
		Form Setup
	*/
  const formik = useFormik({
    initialValues: {
      url: menuItem?.url ?? '',
      order: menuItem?.order ?? '',
      display_on_home_page: BoolToYesNo(menuItem?.display_on_home_page) ?? 'No'
    },
    validationSchema: AddServiceScheme,
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
    let FunctionToCall = serviceService.addservice;
    if (editing) FunctionToCall = serviceService.updateService;

    const data = {
      ...values,
      display_on_home_page: YesNoToBool(values.display_on_home_page)
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
    navigate(RoutehomeSectionsPage);
  };

  /*
		Use Effect Hooks.
	*/

  /*
		Main Design
	*/
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Service Details
        </Typography>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Url</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="url"
                {...getFieldProps('url')}
                error={Boolean(touched.url && errors.url)}
                helperText={touched.url && errors.url}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Url</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="url"
                {...getFieldProps('url')}
                error={Boolean(touched.url && errors.url)}
                helperText={touched.url && errors.url}
              />
            </Grid> */}
            <Grid item sm={6} md={3}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Order</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="order"
                {...getFieldProps('order')}
                error={Boolean(touched.order && errors.order)}
                helperText={touched.order && errors.order}
              />
            </Grid>

            <Grid item sm={6} md={3}>
              <SelectYesNo
                getFieldProps={getFieldProps}
                fieldName="display_on_home_page"
                label="Display on Home Page"
                touched={touched}
                errors={errors}
              />
            </Grid>
          </Grid>
        </ContentStyle>

        <ContentStyle>
          <Grid container spacing={3}></Grid>
        </ContentStyle>

        <Dialog buttonText={'Close'} openDialog={openDia} handleButton={handleClose}>
          {editing ? 'Service updated' : `Service is added`}
        </Dialog>
        <AlertSnackbar severity="warning" open={wrongFile}>
          File type not allowed
        </AlertSnackbar>

        <LoadingFormButton loading={isSubmitting}>{editing ? 'Save' : 'Add'}</LoadingFormButton>
        <ServerError open={serverError || !!errors.availability}>
          {serverError ? serverError : errors.availability}
        </ServerError>
      </Form>
    </FormikProvider>
  );
};
