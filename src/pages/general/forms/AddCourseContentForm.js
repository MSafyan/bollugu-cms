/*
    Imports
*/
import { Box, Button, CircularProgress, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { AddCourseContentSchema } from 'src/config/form-schemas';
import { DefaultUploadedFileImage } from 'src/config/settings';
import { ClassContext } from 'src/pages/teachers/context/ClassContext';
import courseContentService from 'src/services/CourseContentService';
import notificationService from 'src/services/NotificationService';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';

/*
    Main Working
*/
export default ({ course, editing, teacher, classes }) => {

  const [serverError, setServerError] = useState('');
  const [openDia, setOpenDia] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [wrongFile, setWrongFile] = useState(false);

  let reload;
  if (classes)
    reload = useContext(ClassContext).reload;

  const navigate = useNavigate();

  const courseContentID = useParams().courseContentID;

  const formik = useFormik({
    initialValues: {
      course: teacher ? (classes.id ? `${classes.name}` : '') : (course ? `${course.name} - ${course.code}` : ''),
      type: 'File',
      topic: '',
      file: '',
      details: '',
      url: ''
    },

    validationSchema: AddCourseContentSchema,

    onSubmit: () => {
      setSubmitting(true);
      addData();
    }
  });

  const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting } = formik;

  const addData = () => {

    let FunctionToCall = courseContentService.add;
    if (courseContentID)
      FunctionToCall = courseContentService.update;

    FunctionToCall(teacher ? classes.id : null, teacher ? null : course.id, values.topic, values.type, values.details, values.url, values.file, courseContentID)
      .then(() => {
        if (teacher) {
          notificationService.addClass(classes.id, `${classes.teacher.name}`, `uploaded content ${values.type} ${values.topic}.`, `/student/${classes.name}/course-contents`);
        }
        setOpenDia(true);
      })
      .catch((_err) => {
        setServerError('Something went wrong.');
        setSubmitting(false);
      }).finally();
  };

  const handleediting = () => {
    if (editing) {
      courseContentService.getOne(courseContentID)
        .then((data) => {
          setFieldValue('type', data.type);
          setFieldValue('topic', data.topic);
          setFieldValue('details', data.details);
          setFieldValue('url', data.url);
          setFieldValue('file', data.file.id);
        })
        .catch((_err) => {
          // Error here
        });
    }
  };

  const handleClose = () => {
    if (classes)
      reload();
    setOpenDia(false);
    navigate(editing ? './../../' : './..');
  };

  const handleImageChange = () => {
    setWrongFile(false);
    setFieldValue('file', '');
    if (selectedImage) {
      courseContentService.upload(selectedImage, values.topic.length > 10 ? values.topic.slice(0, 9) : values.topic, null)
        .then((response) => {
          setFieldValue('file', response.data[0].id);
        })
        .catch((err) => {
          if (err.fileUploadError) {
            setSelectedImage();
            setWrongFile(err.msg);
            setTimeout(() => setWrongFile(false), hideFileAlertIn);
          }
        });

    }
  };

  useEffect(handleediting, [values.courseContentID]);
  useEffect(handleImageChange, [selectedImage]);

  return (
    <FormikProvider value={formik}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          {editing ? "Edit" : "Add"} Course Content
        </Typography>
      </Stack>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

        {course &&
          <ContentStyle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <ThemeProvider theme={FormTheme}>
                  <InputLabel label="Courses">{teacher ? 'Class Name' : 'Course ID'}</InputLabel>
                </ThemeProvider>
                <TextField
                  fullWidth
                  {...getFieldProps('course')}
                  error={Boolean(touched.course && errors.course)}
                  helperText={touched.course && errors.course}
                  disabled={true}
                />

              </Grid>
            </Grid>
          </ContentStyle>}

        <Typography variant="h6" marginTop={4}>
          Select Category
        </Typography>
        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel label="Category">Category</InputLabel>
              </ThemeProvider>
              <Select fullWidth
                {...getFieldProps('type')}
                error={Boolean(touched.type && errors.type)}
                disabled={editing}
              >

                <MenuItem key='File' value='File'>File</MenuItem>
                <MenuItem key='Video' value='Video'>Video</MenuItem>
                <MenuItem key='Url' value='Url'>Url</MenuItem>

              </Select>
            </Grid>
          </Grid>
        </ContentStyle>

        {
          values.type == 'File' &&
          <ContentStyle>
            <Typography variant="h6" marginTop={4}>
              Upload File
            </Typography>
            <ContentStyle>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <input
                    disabled={values.topic.length < 1 || editing}
                    accept="*/*"
                    type="file"
                    id="select-image"
                    style={{ display: 'none' }}
                    onChange={e => setSelectedImage(e.target.files[0])}
                  />
                  <label htmlFor="select-image">
                    <Button
                      disabled={values.topic.length < 1 || editing}
                      variant="outlined" color='primary' component="span"
                    >

                      Upload File
                    </Button>

                  </label>
                  {(selectedImage || editing) && (
                    <Box mt={2} textAlign="center">
                      {values.file ? <img src={DefaultUploadedFileImage} alt={"Uploaded"} height="100px" /> : <CircularProgress color="primary" />}
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


        }
        {
          values.type != 'File' &&
          <ContentStyle>

            <Typography variant="h6" marginTop={4}>
              Upload {values.type}
            </Typography>
            <ContentStyle>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <ThemeProvider theme={FormTheme}>
                    <InputLabel>Link</InputLabel>
                  </ThemeProvider>
                  <TextField
                    fullWidth
                    {...getFieldProps('url')}
                    inputProps={{
                      inputMode: 'url',
                    }}
                    error={Boolean(touched.url && errors.url)}
                    helperText={touched.url && errors.url}
                  />
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
        }

        <Dialog
          buttonText={"Close"}
          openDialog={openDia}
          handleButton={handleClose}
        >
          Course Content is {editing ? 'updated' : 'added'}
        </Dialog >
        <AlertSnackbar severity="warning" open={wrongFile}>
          Extension not allowed
        </AlertSnackbar>
        <LoadingFormButton loading={isSubmitting}>
          {editing ? 'Save' : 'Add'}
        </LoadingFormButton>
        {(serverError || touched.file && errors.file) &&
          <Stack sx={{ width: '50%' }} marginTop={3}>
            <Collapse in={openServerError}>
              <Alert severity="error">
                {serverError || touched.file && errors.file}
              </Alert>
            </Collapse>
          </Stack>
        }

      </Form>
    </FormikProvider >
  );
};


