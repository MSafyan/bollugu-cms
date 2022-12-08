/*
    Imports
*/
import { Icon } from '@iconify/react';
import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { provinces } from 'src/config/data';
import { SettingsSchema } from 'src/config/form-schemas';
import { HidePasswordIcon, PasswordIcon, ShowPasswordIcon } from 'src/config/icons';
import { acceptImageUpload, DefaultAvatar } from 'src/config/settings';
import { DashboardContext } from 'src/layouts/dashboard';
import adminService from 'src/services/AdminService';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import coordinatorService from 'src/services/CoordinatorService';
import studentService from 'src/services/StudentService';
import teacherService from 'src/services/TeacherService';
import userService from 'src/services/UserService';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';

/*
        Main Working
*/
export default ({ cities, loggedInUser }) => {

  /*
          States, Params, Navigation, Query, Variables.
  */
  const [serverError, setServerError] = useState('');
  const [password, setPassword] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageID, setImageID] = useState(null);
  const [wrongFile, setWrongFile] = useState(false);

  const userType = (useParams().type || '').toLowerCase();
  const userID = useParams().id;
  const ownSettings = !userID;

  const { reload } = useContext(DashboardContext);


  /*
          Form Setup
  */

  const formik = useFormik({
    initialValues: {
      contact: '',
      province: '',
      city: '',
      email: '',
      address: '',
      password: '',
      confirm: ''
    },
    validationSchema: SettingsSchema(password),
    onSubmit: () => {
      addData();
    }
  });

  const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting } = formik;

  /*
    Handlers
  */

  const addData = () => {

    let serviceToCall = adminService;

    if (loggedInUser.isCoordinator)
      serviceToCall = coordinatorService;
    if (loggedInUser.isTeacher)
      serviceToCall = teacherService;
    if (loggedInUser.isStudent)
      serviceToCall = studentService;
    const contact = {
      city: values.city,
      address: values.address,
      phone: values.contact
    };

    serviceToCall.settingsUpdate(values.name, values.email, values.password, values.dob, values.gender, contact, imageID, values.u_id, values.a_id)
      .then(() => {
        if (ownSettings)
          serviceToCall.getOne(values.a_id)
            .then((updatedUser) => {
              serviceToCall.reAsignUser(updatedUser);
              setOpenDia(true);
            })
            .catch(() => {
              setServerError('An Error Occured');
            });
        else setOpenDia(true);
      })
      .catch(() => {
        setServerError('An Error Occured');

      }).finally(() => {
        setSubmitting(false);
      });
  };

  const handleProvinceChange = () => {
    if (!cities) return;
    setFieldValue('city', (cities.find(city => city.province == values.province)).id);
  };

  const handleIDChange = () => {
    let funcToCall = userService.getLoggedInUser;

    let ID = loggedInUser.id;

    if (ownSettings)
      userService.getLoggedInUser()
        .then((data) => {
          prefillData(data);
        })
        .catch(() => {
          navigate('/401');
        });
    else {
      if (userID) {
        setSameUser(false);
        funcToCall = adminService.find;
        switch (userType) {
          case 'coordinator':
            funcToCall = coordinatorService.find;
            break;
          case 'teacher':
            funcToCall = teacherService.find;
            break;
          case 'student':
            funcToCall = studentService.find;
            break;
        }
      }
      funcToCall(ID)
        .then((data) => {
          prefillData(data);
        })
        .catch(() => {
          navigate('/404');
        });
    }

  };


  function prefillData(data) {
    setFieldValue('ID', data.username);
    setFieldValue('email', data.email);
    setFieldValue('name', data.name);
    setFieldValue('password', data.confirm);
    setFieldValue('dob', data.dob);
    setFieldValue('gender', data.gender);
    setFieldValue('u_id', data.u_id);
    setFieldValue('address', data.address);
    setFieldValue('contact', data.phone);
    setFieldValue('city', data.city_id);
    setFieldValue('province', data.province);
    setImageID(data.imageID);
    setImageUrl(data.image || DefaultAvatar);
    setFieldValue('a_id', data.id);
  }

  const handleImageChange = () => {
    setWrongFile(false);
    setImageUrl(null);
    if (selectedImage) {
      coordinatorService.upload(selectedImage, values.ID.replaceAll(' ', ''), null)
        .then((response) => {
          setImageID(response.data[0].id);
          setImageUrl(URL.createObjectURL(selectedImage));
        })
        .catch((err) => {
          if (err.fileUploadError) {
            setImageUrl(DefaultAvatar);
            setWrongFile(err.msg);
            setTimeout(() => setWrongFile(false), hideFileAlertIn);
          }
        });

    }
  };

  const handleClose = () => {
    setOpenDia(false);
    reload();
    navigate(`../profile`);
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

  useEffect(handleProvinceChange, [values.province]);
  useEffect(handleIDChange, [loggedInUser]);
  useEffect(handleImageChange, [selectedImage]);
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
                <InputLabel>Contact Number</InputLabel>
              </ThemeProvider>
              <NumberFormat
                fullWidth
                customInput={TextField}
                type="text"
                format="####-#######"
                allowEmptyFormatting="true"
                {...getFieldProps('contact')}
                inputProps={{
                  inputMode: 'numeric',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon inline="true" style={{ fontSize: 25 }} />
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.contact && errors.contact)}
                helperText={touched.contact && errors.contact}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Email</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="currentEmail"
                {...getFieldProps('email')}
                inputProps={{
                  inputMode: 'email'
                }}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
          </Grid>
        </ContentStyle>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel label="province">Province</InputLabel>
              </ThemeProvider>
              <Select fullWidth
                {...getFieldProps('province')}
                error={Boolean(touched.province && errors.province)}
              >
                {
                  provinces.map(row => (
                    <MenuItem key={row} value={row}>{row.replaceAll('_', ' ')}</MenuItem>
                  ))
                }
              </Select>
            </Grid>
            {cities &&
              <Grid item xs={12} sm={6} md={6}>
                <ThemeProvider theme={FormTheme}>
                  <InputLabel label="city">City</InputLabel>
                </ThemeProvider>
                <Select fullWidth
                  {...getFieldProps('city')}
                  error={Boolean(touched.city && errors.city)}
                >
                  {
                    cities.filter((row) => row.province == values.province).map(row => (
                      <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                    ))
                  }
                </Select>
              </Grid>}
          </Grid>
        </ContentStyle>


        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel label="Address">Address</InputLabel>
              </ThemeProvider>
              <TextField
                multiline
                rows={4}
                fullWidth
                {...getFieldProps('address')}
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address}
              />
            </Grid>
          </Grid>
        </ContentStyle>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>

              <input
                accept={acceptImageUpload}
                type="file"
                id="select-image"
                style={{ display: 'none' }}
                onChange={e => setSelectedImage(e.target.files[0])}
              />
              <label htmlFor="select-image">
                <Button
                  variant="outlined" color='primary' component="span">
                  Upload Image
                </Button>
              </label>
              {(
                imageUrl ? <Box mt={2} textAlign="center">
                  <img src={imageUrl} alt={values.ID} height="100px" />
                </Box> :
                  <Box mt={2} textAlign="center">
                    <CircularProgress color="primary" />
                  </Box>
              )}

            </Grid>
          </Grid>
        </ContentStyle>

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
        <AlertSnackbar severity="warning" open={wrongFile}>
          Extension not allowed
        </AlertSnackbar>

        <LoadingFormButton loading={(isSubmitting || !imageUrl)}>
          Save
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

