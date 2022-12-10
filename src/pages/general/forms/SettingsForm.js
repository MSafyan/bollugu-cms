/*
    Imports
*/
import { Icon } from '@iconify/react';
import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Alert, Collapse } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { Cities, cuisines } from 'src/config/data';
import { SettingsSchema } from 'src/config/form-schemas';
import { HidePasswordIcon, PasswordIcon, ShowPasswordIcon } from 'src/config/icons';
import { RouteProfile } from 'src/config/routes';
import { acceptFileUpload, acceptImageUpload, DefaultAvatar, DefaultUploadedFileImage } from 'src/config/settings';
import userService from 'src/services/UserService';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';

/*
        Main Working
*/
export default ({ user }) => {

  /*
          States, Params, Navigation, Query, Variables.
  */
  const [serverError, setServerError] = useState('');
  const [password, setPassword] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(user.image?.url);
  const [imageID, setImageID] = useState(user.image?.id);
  const [wrongImageFile, setwrongImageFile] = useState(false);

  const [selectedIns, setSelectedIns] = useState(null);
  const [insuranceUrl, setinsuranceUrl] = useState(user.insurance?.url);
  const [insuranceID, setinsuranceID] = useState(user.insurance?.id);
  const [wrongInsFile, setwrongInsFile] = useState(false);

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificateUrl, setcertificateUrl] = useState(user.certificate?.url);
  const [certificateID, setcertificateID] = useState(user.certificate?.id);
  const [wrongCertificateFile, setWrongCertificateFile] = useState(false);

  /*
          Form Setup
  */

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName ?? '',
      city: user.city ?? '',
      cuisineName: user.cuisineName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      long: user.long ?? '',
      password: '',
      confirm: ''
    },
    validationSchema: SettingsSchema,
    onSubmit: () => {
      addData();
    }
  });

  const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting } = formik;

  /*
    Handlers
  */

  const addData = () => {

    const data = {
      ...values,
      image: imageID,
      insurance: insuranceID,
      certificate: certificateID,
    };

    userService.updateUser(data, user.id)
      .then(() => {
        userService.getMe()
          .then(() => {

            setOpenDia(true);
          })
          .catch(() => {
            setServerError('An Error Occured');
          });

      })
      .catch(() => {
        setServerError('An Error Occured');

      }).finally(() => {
        setSubmitting(false);
      });
  };



  const handleImageChange = () => {
    if (!selectedImage)
      return;
    setwrongImageFile(false);
    setImageUrl(null);
    if (selectedImage) {
      userService.upload(selectedImage, values.firstName, null)
        .then((response) => {
          setImageID(response.data[0].id);
          setImageUrl(URL.createObjectURL(selectedImage));
        })
        .catch((err) => {
          if (err.fileUploadError) {
            setImageUrl(DefaultAvatar);
            setwrongImageFile(err.msg);
            setTimeout(() => setwrongImageFile(false), hideFileAlertIn);
          }
        });
    }
  };

  const handleInsuranceChange = () => {
    if (!selectedIns)
      return;
    setwrongInsFile(false);
    setinsuranceUrl(null);
    if (selectedIns) {
      userService.upload(selectedIns, values.firstName + "-insurance", null)
        .then((response) => {
          setinsuranceID(response.data[0].id);
          setinsuranceUrl(URL.createObjectURL(selectedIns));
        })
        .catch((err) => {
          if (err.fileUploadError) {
            setinsuranceUrl(DefaultUploadedFileImage);
            setwrongInsFile(err.msg);
            setTimeout(() => setwrongInsFile(false), hideFileAlertIn);
          }
        });
    }
  };

  const handleCertificateChange = () => {
    if (!selectedCertificate)
      return;
    setWrongCertificateFile(false);
    setcertificateUrl(null);
    if (selectedCertificate) {
      userService.upload(selectedCertificate, values.firstName + "-certificate", null)
        .then((response) => {
          setcertificateID(response.data[0].id);
          setcertificateUrl(URL.createObjectURL(selectedCertificate));
        })
        .catch((err) => {
          if (err.fileUploadError) {
            setcertificateUrl(DefaultUploadedFileImage);
            setWrongCertificateFile(err.msg);
            setTimeout(() => setWrongCertificateFile(false), hideFileAlertIn);
          }
        });
    }
  };

  const handleClose = () => {
    setOpenDia(false);
    navigate(RouteProfile);
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handlePasswordUpdate = () => {
    setPassword(values.password);
  };

  /*
      Use Effect Hooks.
  */


  useEffect(handleImageChange, [selectedImage]);
  useEffect(handleInsuranceChange, [selectedIns]);
  useEffect(handleCertificateChange, [selectedCertificate]);
  useEffect(handlePasswordUpdate, [values.password]);

  /*
          Main Design
  */
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

        <Typography variant="h6" gutterBottom>
          Personal Details
        </Typography>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Name</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="name"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Location</InputLabel>
              </ThemeProvider>
              <Select fullWidth
                {...getFieldProps('city')}
                error={Boolean(touched.city && errors.city)}
              >
                {
                  Cities.map(row => (
                    <MenuItem key={row} value={row}>{row}</MenuItem>
                  ))
                }
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Contact</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="contact"
                {...getFieldProps('phoneNumber')}
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Cuisine</InputLabel>
              </ThemeProvider>
              <Select fullWidth
                {...getFieldProps('cuisineName')}
                error={Boolean(touched.cuisineName && errors.cuisineName)}
              >
                {
                  cuisines.map(row => (
                    <MenuItem key={row} value={row}>{row}</MenuItem>
                  ))
                }
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Bio</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                autoComplete="bio"
                {...getFieldProps('long')}
                error={Boolean(touched.long && errors.long)}
                helperText={touched.long && errors.long}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={2}>

              <input
                disabled={values.firstName.length < 2}
                accept={acceptImageUpload}
                type="file"
                id="select-image"
                style={{ display: 'none' }}
                onChange={e => setSelectedImage(e.target.files[0])}
              />
              <label htmlFor="select-image">
                <Button
                  disabled={values.firstName.length < 2}
                  variant="outlined" color='primary' component="span">
                  Upload Image
                </Button>
              </label>
              {(imageUrl) && (
                imageUrl ? <Box mt={2} textAlign="center">
                  <img src={imageUrl} alt={values.firstName} height="100px" />
                </Box> :
                  <Box mt={2} textAlign="center">
                    <CircularProgress color="primary" />
                  </Box>
              )}

            </Grid>

            <Grid item xs={4} sm={4} md={2}>

              <input
                disabled={values.firstName.length < 2}
                accept={acceptFileUpload}
                type="file"
                id="select-insurance"
                style={{ display: 'none' }}
                onChange={e => setSelectedIns(e.target.files[0])}
              />
              <label htmlFor="select-insurance">
                <Button
                  disabled={values.firstName.length < 2}
                  variant="outlined" color='primary' component="span">
                  Upload insurance
                </Button>
              </label>
              {(insuranceUrl) && (
                insuranceUrl ? <Box mt={2} textAlign="center">
                  <img src={DefaultUploadedFileImage} alt={values.firstName + "Insurance"} height="100px" />
                </Box> :
                  <Box mt={2} textAlign="center">
                    <CircularProgress color="primary" />
                  </Box>
              )}

            </Grid>

            <Grid item xs={4} sm={4} md={2}>
              <input
                disabled={values.firstName.length < 2}
                accept={acceptFileUpload}
                type="file"
                id="select-certificate"
                style={{ display: 'none' }}
                onChange={e => setSelectedCertificate(e.target.files[0])}
              />
              <label htmlFor="select-certificate">
                <Button
                  disabled={values.firstName.length < 2}
                  variant="outlined" color='primary' component="span">
                  Upload certificate
                </Button>
              </label>
              {(certificateUrl) && (
                certificateUrl ? <Box mt={2} textAlign="center">
                  <img src={DefaultUploadedFileImage} alt={values.firstName + "certificate"} height="100px" />
                </Box> :
                  <Box mt={2} textAlign="center">
                    <CircularProgress color="primary" />
                  </Box>
              )}

            </Grid>
          </Grid>
        </ContentStyle>

        <Typography variant="h6" gutterBottom>
          Update Password
        </Typography>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>New Password</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                {...getFieldProps('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? HidePasswordIcon : ShowPasswordIcon} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon={PasswordIcon} inline="true" style={{ fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}

              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Confirm Password</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                {...getFieldProps('confirm')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? HidePasswordIcon : ShowPasswordIcon} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon={PasswordIcon} inline="true" style={{ fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.confirm && errors.confirm)}
                helperText={touched.confirm && errors.confirm}
              />
            </Grid>
          </Grid>
        </ContentStyle>

        <Dialog
          buttonText={"Close"}
          openDialog={openDia}
          handleButton={handleClose}
        >
          Your data is updated
        </Dialog>
        <AlertSnackbar severity="warning" open={wrongImageFile || wrongInsFile}>
          Extension not allowed
        </AlertSnackbar>

        <LoadingFormButton loading={(isSubmitting || (!!selectedImage && !imageUrl) || (!!selectedIns && !insuranceUrl))}>
          Save
        </LoadingFormButton>
        {serverError &&
          <Stack sx={{ width: '50%' }} marginTop={3}>
            <Collapse in={!!serverError}>
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

