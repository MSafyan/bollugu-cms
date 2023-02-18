/*
	Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLayouts from '../../../services/useLayoutHook';
/*
	Imports:
		Material UI
*/
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  TextField,
  Typography
} from '@mui/material';
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
import { RouteWork } from 'src/config/routes';
import serviceService from 'src/services/WorkServiceClass';
import { acceptImageUpload } from '../../../config/settings';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { WorkItemSchema } from 'src/config/form-schemas';
import { SelectColor } from './AboutForm';
import { PRIMARY } from 'src/theme/palette';

/*
	Main Working
*/
export default ({ menuItem, editing }) => {
  /*
		States, Params, Navigation, Query, Variables.
	*/
  const [serverError, setServerError] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(menuItem?.image?.url);
  const [imageID, setImageID] = useState(menuItem?.image?.id);
  const [wrongFile, setWrongFile] = useState(false);

  const navigate = useNavigate();

  /*
		Form Setup
	*/
  const formik = useFormik({
    initialValues: {
      title: menuItem?.title ?? '',
      layout: menuItem?.layout ?? '',
      metaDescription: menuItem?.metaDescription ?? '',
      background: menuItem?.background?.id ?? '',
      layout: menuItem?.layout?.id ?? ''
    },
    validationSchema: WorkItemSchema,
    onSubmit: (_values, { setFieldError }) => {
      setSubmitting(true);
      addData();
    }
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setSubmitting,
    setFieldValue
  } = formik;

  /*
		Handlers
	*/
  const addData = () => {
    let FunctionToCall = serviceService.add;
    if (editing) FunctionToCall = serviceService.update;

    const data = {
      ...values,
      image: imageID
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
    navigate(RouteWork);
  };

  const handleImageChange = () => {
    if (!selectedImage) return;
    setWrongFile(false);
    setImageUrl(null);
    if (selectedImage) {
      serviceService
        .upload(selectedImage, values.title, null)
        .then((response) => {
          setImageID(response.data[0].id);
          setImageUrl(URL.createObjectURL(selectedImage));
        })
        .catch((err) => {
          if (err.fileUploadError) {
            setImageUrl(null);
            setImageID();
            setWrongFile(err.msg);
            setTimeout(() => setWrongFile(false), hideFileAlertIn);
          }
        });
    }
  };

  /*
		Use Effect Hooks.
	*/
  useEffect(handleImageChange, [selectedImage]);

  /*
		Main Design
	*/
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Background Details
        </Typography>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item sm={12} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Title</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="title"
                {...getFieldProps('title')}
                error={Boolean(touched.title && errors.title)}
                helperText={touched.title && errors.title}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Meta Description</InputLabel>
              </ThemeProvider>
              <TextField
                multiline
                rows={4}
                fullWidth
                autoComplete="metaDescription"
                {...getFieldProps('metaDescription')}
                error={Boolean(touched.metaDescription && errors.metaDescription)}
                helperText={touched.metaDescription && errors.metaDescription}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <SelectColor
                getFieldProps={getFieldProps}
                fieldName="background"
                label="Backgroud"
                touched={touched}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <input
                disabled={values.title.length < 2}
                accept={acceptImageUpload}
                type="file"
                id="select-image"
                style={{ display: 'none' }}
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              <label htmlFor="select-image">
                <Button
                  disabled={values.title.length < 2}
                  variant="outlined"
                  color="primary"
                  component="span"
                >
                  Upload Image
                </Button>
              </label>
              {imageUrl &&
                (imageUrl ? (
                  <Box mt={2} textAlign="center">
                    <img src={imageUrl} alt={values.title} height="100px" />
                  </Box>
                ) : (
                  <Box mt={2} textAlign="center">
                    <CircularProgress color="primary" />
                  </Box>
                ))}
            </Grid>
          </Grid>
          <SelectTemplateLayout
            getFieldProps={getFieldProps}
            fieldName="layout"
            label="Template"
            touched={touched}
            errors={errors}
            setFieldValue={setFieldValue}
            values={values}
          />
        </ContentStyle>

        <ContentStyle>
          <Grid container spacing={3}></Grid>
        </ContentStyle>

        <Dialog buttonText={'Close'} openDialog={openDia} handleButton={handleClose}>
          {editing ? 'Work updated' : `Work is added`}
        </Dialog>
        <AlertSnackbar severity="warning" open={wrongFile}>
          File type not allowed
        </AlertSnackbar>

        <LoadingFormButton loading={isSubmitting || (selectedImage && !imageUrl)}>
          {editing ? 'Save' : 'Add'}
        </LoadingFormButton>
        <ServerError open={serverError || !!errors.availability}>
          {serverError ? serverError : errors.availability}
        </ServerError>
      </Form>
    </FormikProvider>
  );
};

export const SelectTemplateLayout = ({
  values,
  fieldName,
  label,
  getFieldProps,
  touched,
  errors,
  setFieldValue
}) => {
  const { layouts } = useLayouts();
  return (
    <Box
      sx={{
        mt: 2
      }}
    >
      <ThemeProvider theme={FormTheme}>
        <InputLabel>{label}</InputLabel>
      </ThemeProvider>
      <Grid container spacing={3}>
        {layouts.map((_, index) => {
          return (
            <Grid item xs={4} sm={3} md={2} key={index}>
              <Box
                {...getFieldProps(fieldName)}
                onClick={() => {
                  setFieldValue(fieldName, _.id);
                }}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.500',
                  borderRadius: '5px',
                  padding: 1,
                  cursor: 'pointer',
                  ...(values[fieldName] === _.id && {
                    backgroundColor: PRIMARY.main
                  })
                }}
                error={Boolean(touched[fieldName] && errors[fieldName])}
                helperText={touched[fieldName] && errors[fieldName]}
              >
                <img src={_.image?.url} alt="1" />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
