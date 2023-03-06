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
  MenuItem,
  Select,
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
import { RoutehomeSectionsPage } from 'src/config/routes';
import serviceService from 'src/services/HomeSectionsServiceClass';
import { acceptFileUpload, TemplateHas } from '../../../config/settings';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { HomeSectionItemSchema } from 'src/config/form-schemas';
import {
  SelectImagePosition,
  SelectPosition,
  SelectTemplate,
  SelectTemplateLayout
} from './Selects';

/*
	Main Working
*/
export default ({ menuItem, editing, serviceId }) => {
  /*
		States, Params, Navigation, Query, Variables.
	*/
  const [serverError, setServerError] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(menuItem?.images_list?.map((item) => item.url));
  const [imageID, setImageID] = useState(menuItem?.images_list?.map((item) => item.id) ?? []);
  const [wrongFile, setWrongFile] = useState(false);

  const navigate = useNavigate();

  /*
		Form Setup
	*/
  const formik = useFormik({
    initialValues: {
      text_one_type: menuItem?.text_one_type ?? 'none',
      text_one: menuItem?.text_one ?? '',
      text_two_type: menuItem?.text_two_type ?? 'none',
      text_two: menuItem?.text_two ?? '',
      text_three_type: menuItem?.text_three_type ?? 'none',
      text_three: menuItem?.text_three ?? '',
      template_layout: menuItem?.template_layout ?? '',

      image_one_type: menuItem?.image_one_type ?? 'none',
      image_two_type: menuItem?.image_two_type ?? 'none',

      template_order: menuItem?.template_order ?? '',
      template_type: menuItem?.template_type ?? ''
    },
    validationSchema: HomeSectionItemSchema,
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
    debugger;
    let FunctionToCall = serviceService.add;
    if (editing) FunctionToCall = serviceService.update;

    if (values.text_one_type === 'none') {
      values.text_one = '""';
    }
    if (values.text_two_type === 'none') {
      values.text_two = '""';
    }
    if (values.text_three_type === 'none') {
      values.text_three = '""';
    }

    const data = {
      ...values,
      images_list: [...imageID]
    };
    if (serviceId) {
      data.section = serviceId;
    }

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

  const handleImageChange = () => {
    if (!selectedImage) return;
    setImageUrl(null);
    setImageID([]);
    setWrongFile(false);
    if (selectedImage) {
      Object.values(selectedImage).map((item) => {
        serviceService
          .upload(item, values.title, null)
          .then((response) => {
            setImageID((prev) => [...prev, response.data[0].id]);
            var imgUrls = imageUrl ?? [];
            debugger;
            setImageUrl([...imgUrls, response.data[0].url]);
          })
          .catch((err) => {
            debugger;
            if (err.fileUploadError) {
              setImageUrl([]);
              setImageID([]);
              setWrongFile(err.msg);
              setTimeout(() => setWrongFile(false), hideFileAlertIn);
            }
          });
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
  const title = 'Home Top Page';
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          {title} Details
        </Typography>

        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item sm={6}>
              <ThemeProvider theme={FormTheme}>
                <InputLabel>Order</InputLabel>
              </ThemeProvider>
              <TextField
                fullWidth
                autoComplete="template_order"
                {...getFieldProps('template_order')}
                error={Boolean(touched.template_order && errors.template_order)}
                helperText={touched.template_order && errors.template_order}
              />
            </Grid>

            <Grid item sm={6}>
              <SelectTemplate
                getFieldProps={getFieldProps}
                fieldName="template_type"
                label="Template Type"
                touched={touched}
                errors={errors}
              />
            </Grid>
          </Grid>

          {/* Text Type  */}
          <Grid container spacing={3}>
            <ShowChildren fieldName="text_one_type" values={values}>
              <Grid item sm={12} md={4}>
                <SelectPosition
                  getFieldProps={getFieldProps}
                  fieldName="text_one_type"
                  label="Text One Position"
                  touched={touched}
                  errors={errors}
                />
              </Grid>
            </ShowChildren>

            <ShowChildren fieldName="text_two_type" values={values}>
              <Grid item sm={12} md={4}>
                <SelectPosition
                  getFieldProps={getFieldProps}
                  fieldName="text_two_type"
                  label="Text Two Position"
                  touched={touched}
                  errors={errors}
                />
              </Grid>
            </ShowChildren>

            <ShowChildren fieldName="text_three_type" values={values}>
              <Grid item sm={12} md={4}>
                <SelectPosition
                  getFieldProps={getFieldProps}
                  fieldName="text_three_type"
                  label="caption Text Position"
                  touched={touched}
                  errors={errors}
                />
              </Grid>
            </ShowChildren>
          </Grid>

          {/* Descriptions  */}
          <Grid container spacing={3}>
            <ShowChildren fieldName="text_one" values={values}>
              <Grid item sm={12} md={4}>
                {values.text_one_type !== 'none' && (
                  <>
                    <ThemeProvider theme={FormTheme}>
                      <InputLabel>Meta Description 1</InputLabel>
                    </ThemeProvider>
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      autoComplete="text_one"
                      {...getFieldProps('text_one')}
                    />
                  </>
                )}
              </Grid>
            </ShowChildren>

            <ShowChildren fieldName="text_two" values={values} dependy="text_two_type">
              <Grid item sm={12} md={4}>
                {values.text_two_type !== 'none' && (
                  <>
                    <ThemeProvider theme={FormTheme}>
                      <InputLabel>Meta Description2</InputLabel>
                    </ThemeProvider>
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      autoComplete="text_two"
                      {...getFieldProps('text_two')}
                    />
                  </>
                )}
              </Grid>
            </ShowChildren>

            <ShowChildren fieldName="text_three" values={values}>
              <Grid item sm={12} md={4}>
                {values.text_three_type !== 'none' && (
                  <>
                    <ThemeProvider theme={FormTheme}>
                      <InputLabel>Caption</InputLabel>
                    </ThemeProvider>
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      autoComplete="text_three"
                      {...getFieldProps('text_three')}
                    />
                  </>
                )}
              </Grid>
            </ShowChildren>
          </Grid>

          <Grid container spacing={3} style={{ paddingTop: '3rem' }}>
            <ShowChildren fieldName="image_one_type" values={values}>
              <Grid item sm={12} md={3}>
                {/* {values.text_one_type === 'none' && ( */}
                <SelectImagePosition
                  getFieldProps={getFieldProps}
                  fieldName="image_one_type"
                  label="Image One Type"
                  touched={touched}
                  errors={errors}
                />
                {/* )} */}
              </Grid>
            </ShowChildren>

            <ShowChildren fieldName="image_two_type" values={values}>
              <Grid item sm={12} md={3}>
                {/* {values.text_two_type === 'none' && ( */}
                <SelectImagePosition
                  getFieldProps={getFieldProps}
                  fieldName="image_two_type"
                  label="Image Two Type"
                  touched={touched}
                  errors={errors}
                />
                {/* )} */}
              </Grid>
            </ShowChildren>

            <ShowChildren fieldName="images_list" values={values}>
              <Grid item xs={12} sm={6} md={6}>
                <input
                  disabled={values.template_order.length < 1}
                  accept={acceptFileUpload}
                  type="file"
                  id="select-image"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => setSelectedImage(e.target.files)}
                />
                <label htmlFor="select-image">
                  <Button
                    disabled={values.template_order.length < 1}
                    variant="outlined"
                    color="primary"
                    component="span"
                  >
                    Upload Files
                  </Button>
                </label>
                {imageUrl &&
                  (imageUrl ? (
                    imageUrl?.map((image) => (
                      <Box mt={2} textAlign="center">
                        <img src={image} alt={values.title} height="100px" />
                      </Box>
                    ))
                  ) : (
                    <Box mt={2} textAlign="center">
                      <CircularProgress color="primary" />
                    </Box>
                  ))}
              </Grid>
            </ShowChildren>
            <Grid item xs={12}>
              <SelectTemplateLayout
                setFieldValue={setFieldValue}
                getFieldProps={getFieldProps}
                fieldName="template_layout"
                label="Template Layout"
                touched={touched}
                errors={errors}
              />
            </Grid>
          </Grid>
        </ContentStyle>

        <Dialog buttonText={'Close'} openDialog={openDia} handleButton={handleClose}>
          {editing ? `${title} updated` : `${title} is added`}
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

const ShowChildren = ({ values, children, fieldName, dependy }) => {
  if (fieldName === 'image_one_type') {
    debugger;
  }
  var a = !TemplateHas[values.template_layout];
  var b = TemplateHas[values.template_layout]?.hasOwnProperty(fieldName) || false;
  // var c = values[dependy] !== 'none';
  if (a || b) {
    return children;
  } else {
    return null;
  }
};
