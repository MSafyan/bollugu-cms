/*
	Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Editor, EditorState } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
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
import { RouteServices } from 'src/config/routes';
import serviceService from 'src/services/ServicesServiceClass';
import templateService from 'src/services/TemplateClass';
import { acceptImageUpload } from '../../../config/settings';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';

/*
	Main Working
*/
export default ({ menuItem, editing }) => {
  /*
		States, Params, Navigation, Query, Variables.
	*/
  // const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [serverError, setServerError] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(menuItem?.template?.images_list[0].url);
  const [imageID, setImageID] = useState(menuItem?.template?.images_list[0].id);

  const [selectedSvg, setSelectedSvg] = useState(null);
  const [svgUrl, setSvgUrl] = useState(menuItem?.svg?.url || '');
  const [svgID, setSvgID] = useState(menuItem?.svg?.id);

  const [wrongFile, setWrongFile] = useState(false);

  const navigate = useNavigate();

  /*
		Form Setup
	*/
  const formik = useFormik({
    initialValues: {
      title: menuItem?.title ?? '',
      url: menuItem?.url ?? '',
      order: menuItem?.order ?? '',
      text_two: menuItem?.text_two ?? '',
      text_two_type: 'white_bg_title_text',

      image_one_type: 'horizontal',
      image_two_type: 'none',
      template_type: 'white_background',

      text_one: '""',
      text_one_type: 'none',
      text_three: '""',
      text_three_type: 'none'
    },
    validationSchema: AddMenuItemSchema,
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

    let FunctionToCall2 = templateService.add;
    if (editing) FunctionToCall2 = templateService.update;

    const data = {
      ...values,
      template_order: values.order,
      images_list: [imageID],
      svg: svgID
    };

    FunctionToCall(data, menuItem?.id)
      .then((service) => {
        debugger;
        FunctionToCall2({ ...data, service: service?.data?.id }, menuItem?.template?.id).then(
          (_menuItem) => {
            setOpenDia(true);
          }
        );
      })
      .catch((err) => {
        setServerError('An Error Occured');
        setSubmitting(false);
      })
      .finally();
  };

  const handleClose = () => {
    setOpenDia(false);
    navigate(RouteServices);
  };

  const handleSvgChange = () => {
    handleImageChange(true);
  };

  const handleImageChange = (isSvg = false) => {
    let file = isSvg ? selectedSvg : selectedImage;

    if (!file) return;
    setWrongFile(false);

    isSvg ? setSvgUrl(null) : setImageUrl(null);

    if (file) {
      serviceService
        .upload(file, values.title, null)
        .then((response) => {
          debugger;
          isSvg ? setSvgID(response.data[0].id) : setImageID(response.data[0].id);
          isSvg ? setSvgUrl(response.data[0].url) : setImageUrl(URL.createObjectURL(file));
        })
        .catch((err) => {
          if (err.fileUploadError) {
            isSvg ? setSvgUrl(null) : setImageUrl(null);
            isSvg ? setSvgID(null) : setImageID();
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
  useEffect(handleSvgChange, [selectedSvg]);

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
                <InputLabel>Text Two</InputLabel>
              </ThemeProvider>
              <Editor
                editorState={values.text_two}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(e) => {
                  setFieldValue('text_two', e);
                }}
              />
            </Grid> */}
            <Grid item xs={12} sm={6} md={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Description</InputLabel>
              </ThemeProvider>
              <TextField
                multiline
                rows={4}
                fullWidth
                autoComplete="text_two"
                {...getFieldProps('text_two')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
            <Grid item xs={12} sm={6} md={6}>
              <input
                disabled={values.title.length < 2}
                accept={acceptImageUpload}
                type="file"
                id="select-svg"
                // style={{ display: 'none' }}
                onChange={(e) => {
                  debugger;
                  setSelectedSvg(e.target.files[0]);
                }}
              />
              <label htmlFor="select-svg">
                <Button
                  disabled={values.title.length < 2}
                  variant="outlined"
                  color="primary"
                  component="span"
                >
                  Upload SVG
                </Button>
              </label>
              {svgUrl &&
                (svgUrl ? (
                  <Box mt={2} textAlign="center">
                    <img src={svgUrl} alt={values.title} height="100px" />
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
          {editing ? 'Service updated' : `Service is added`}
        </Dialog>
        <AlertSnackbar severity="warning" open={wrongFile}>
          File type not allowed
        </AlertSnackbar>

        <LoadingFormButton
          loading={isSubmitting || (selectedImage && !imageUrl) || (selectedSvg && !svgUrl)}
        >
          {editing ? 'Save' : 'Add'}
        </LoadingFormButton>
        <ServerError open={serverError || !!errors.availability}>
          {serverError ? serverError : errors.availability}
        </ServerError>
      </Form>
    </FormikProvider>
  );
};
