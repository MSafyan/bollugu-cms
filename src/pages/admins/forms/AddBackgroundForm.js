/*
	Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';
/*
	Imports:
		Material UI
*/
import { Grid, Typography } from '@material-ui/core';
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
import { BackgroundItemSchema } from 'src/config/form-schemas';
import { RouteBackgrouns, RouteFavicons } from 'src/config/routes';
import serviceService from 'src/services/BackgroudServiceClass';
import { ContentStyle } from '../../../theme/form-pages';

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
  const [imageUrl, setImageUrl] = useState(menuItem?.file?.url);
  const [imageID, setImageID] = useState(menuItem?.file?.id);
  const [wrongFile, setWrongFile] = useState(false);

  const navigate = useNavigate();

  /*
		Form Setup
	*/
  const formik = useFormik({
    initialValues: {
      color: menuItem?.color ?? ''
    },
    validationSchema: BackgroundItemSchema,
    onSubmit: (_values, { setFieldError }) => {
      setSubmitting(true);
      addData();
    }
  });

  const { values, errors, isSubmitting, handleSubmit, setSubmitting, setFieldValue } = formik;

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
    navigate(RouteBackgrouns);
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
  const [color, setColor] = useColor('hex', '#121212');

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
            <Grid item xs={12} sm={6} md={6}>
              <ColorPicker
                width={456}
                height={228}
                color={color}
                onChange={(e) => {
                  setFieldValue('color', e.hex);
                  setColor(e);
                }}
                hideHSV
                dark
              />
              ;
            </Grid>
          </Grid>
        </ContentStyle>

        <ContentStyle>
          <Grid container spacing={3}></Grid>
        </ContentStyle>

        <Dialog buttonText={'Close'} openDialog={openDia} handleButton={handleClose}>
          {editing ? 'Background updated' : `Background is added`}
        </Dialog>
        <AlertSnackbar severity="warning" open={wrongFile}>
          File type not allowed
        </AlertSnackbar>

        <LoadingFormButton loading={isSubmitting || (selectedImage && !imageUrl)}>
          {editing ? 'Saved' : 'Add'}
        </LoadingFormButton>
        <ServerError open={serverError || !!errors.availability}>
          {serverError ? serverError : errors.availability}
        </ServerError>
      </Form>
    </FormikProvider>
  );
};
