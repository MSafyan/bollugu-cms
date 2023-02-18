/*
	Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBackgrounds from '../../../services/useBackgroundHook';

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
import { RouteAbout } from 'src/config/routes';
import serviceService from 'src/services/AboutServiceClass';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { AboutSchema } from 'src/config/form-schemas';
import { Checkbox, FormControlLabel, MenuItem, Select, Box } from '@mui/material';
import useBackgroundHook from 'src/services/useBackgroundHook';

/*
	Main Working
*/
export default ({ menuItem, editing, type }) => {
  /*
		States, Params, Navigation, Query, Variables.
	*/
  const [serverError, setServerError] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const { backgrounds } = useBackgroundHook();

  const navigate = useNavigate();

  /*
		Form Setup
	*/
  const formik = useFormik({
    initialValues: {
      email: menuItem?.email ?? '',
      tagline: menuItem?.tagline ?? '',
      address: menuItem?.address ?? '',
      phoneNumber: menuItem?.phoneNumber ?? '',
      metaDescription: menuItem?.metaDescription ?? '',
      activeBackground: menuItem?.activeBackground ?? [],
      inactiveBackground: menuItem?.inactiveBackground ?? [],
      countryList: menuItem?.countryList ?? []
    },
    ...(type === 'overview' && { validationSchema: AboutSchema }),
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
    navigate(RouteAbout);
  };

  /*
		Use Effect Hooks.
	*/

  const title = 'About';
  const handleChange = (event) => {
    var index = event.target.name;
    var checked = event.target.checked;

    var array = [...values.countryList];
    array[index][1] = !checked;
    formik.setFieldValue('countryList', array);
    // console.log(event);
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          {title} Details
        </Typography>

        <ContentStyle>
          {type === 'background' && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12}>
                <ThemeProvider theme={FormTheme}>
                  <InputLabel>Active Backgroud</InputLabel>
                </ThemeProvider>
                <Select
                  fullWidth
                  {...getFieldProps('activeBackground')}
                  error={Boolean(touched.activeBackground && errors.activeBackground)}
                  helperText={touched.activeBackground && errors.activeBackground}
                >
                  {backgrounds.map((row) => {
                    return (
                      <MenuItem key={row.id} value={row.id}>
                        {row?.color || ''}
                        <ColorBox color={row?.color} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <SelectColor
                  getFieldProps={getFieldProps}
                  fieldName="inactiveBackground"
                  label="InActive Backgroud"
                  touched={touched}
                  errors={errors}
                />
              </Grid>
            </Grid>
          )}
          {type === 'overview' && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <ThemeProvider theme={FormTheme}>
                  <InputLabel>address</InputLabel>
                </ThemeProvider>
                <TextField
                  fullWidth
                  autoComplete="address"
                  {...getFieldProps('address')}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThemeProvider theme={FormTheme}>
                  <InputLabel>Tag line</InputLabel>
                </ThemeProvider>
                <TextField
                  fullWidth
                  autoComplete="tagline"
                  {...getFieldProps('tagline')}
                  error={Boolean(touched.tagline && errors.tagline)}
                  helperText={touched.tagline && errors.tagline}
                />
              </Grid>
            </Grid>
          )}
          {type === 'description' && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <ThemeProvider theme={FormTheme}>
                  <InputLabel>Meta Description</InputLabel>
                </ThemeProvider>
                <TextField
                  fullWidth
                  autoComplete="metaDescription"
                  {...getFieldProps('metaDescription')}
                  error={Boolean(touched.metaDescription && errors.metaDescription)}
                  helperText={touched.metaDescription && errors.metaDescription}
                />
              </Grid>
            </Grid>
          )}
          {type === 'map' && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <ThemeProvider theme={FormTheme}>
                  <InputLabel>Country List</InputLabel>
                </ThemeProvider>
                {values.countryList?.length > 0 &&
                  values.countryList.map((item, index) => {
                    debugger;
                    return (
                      <FormControlLabel
                        key={index}
                        label={item}
                        control={
                          <Checkbox checked={item[1] === 1} name={index} onChange={handleChange} />
                        }
                      />
                    );
                  })}
              </Grid>
            </Grid>
          )}
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

export const ColorBox = ({ color }) => {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: 1,
        backgroundColor: color || '',
        ml: 1
      }}
    ></Box>
  );
};

export const SelectColor = ({ getFieldProps, fieldName, label, touched, errors }) => {
  const { backgrounds } = useBackgrounds();

  return (
    <>
      <ThemeProvider theme={FormTheme}>
        <InputLabel>{label}</InputLabel>
      </ThemeProvider>
      <Select
        fullWidth
        {...getFieldProps(fieldName)}
        error={Boolean(touched.inactiveBackground && errors.inactiveBackground)}
        helperText={touched.inactiveBackground && errors.inactiveBackground}
      >
        {backgrounds.map((row) => {
          return (
            <MenuItem key={row.id} value={row.id}>
              {row?.color || ''}
              <ColorBox color={row?.color} />
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};
