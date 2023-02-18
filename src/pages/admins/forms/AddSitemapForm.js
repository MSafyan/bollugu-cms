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
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  TextField,
  Typography
} from '@material-ui/core';
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
import { AddMenuItemSchema } from 'src/config/form-schemas';
import { RouteServices, RouteSitemap } from 'src/config/routes';
import serviceService from 'src/services/SitemapXmlServiceClass';
import { acceptFileUpload, acceptImageUpload } from '../../../config/settings';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';

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
  const [imageUrl, setImageUrl] = useState(menuItem?.svg?.url);
  const [imageID, setImageID] = useState(menuItem?.svg?.id);
  const [wrongFile, setWrongFile] = useState(false);

  const navigate = useNavigate();

  /*
		Form Setup
	*/
  const formik = useFormik({
    initialValues: {},
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
      ...values,
      file: imageID
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
    navigate(RouteSitemap);
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
          Sitemap Details
        </Typography>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <input
                accept={acceptFileUpload}
                type="file"
                id="select-image"
                style={{ display: 'none' }}
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              <label htmlFor="select-image">
                <Button variant="outlined" color="primary" component="span">
                  Upload File
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
        </ContentStyle>

        <ContentStyle>
          <Grid container spacing={3}></Grid>
        </ContentStyle>

        <Dialog buttonText={'Close'} openDialog={openDia} handleButton={handleClose}>
          {editing ? 'Sitemap updated' : `Sitemap is added`}
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
