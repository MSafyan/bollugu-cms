/*
    Imports:
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentStyle } from '../../../theme/form-pages';
import { Grid, Stack, TextField } from '@material-ui/core';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import ServerError from 'src/components/misc/alerts/ServerError';
import batchService from 'src/services/BatchService';

/*
  Main Working
*/
export default ({ madrisa, reload }) => {
  const [serverError, setServerError] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const navigate = useNavigate();

  let year;
  if (madrisa.batch)
    year = madrisa.batch.year + 1;
  else year = new Date().getFullYear();

  const formik = useFormik({
    initialValues: {
      batch: year
    },

    onSubmit: () => {
      addData();
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldError } = formik;

  const addData = () => {

    batchService.addBatch(madrisa.id)
      .then(() => {
        setOpenDia(true);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.error.status === 400)
            setFieldError(element.path[0], 'Already taken');
        }
        else
          setServerError('An Error Occured');
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    setOpenDia(false);
    reload();
    navigate("..");
  };

  return (
    <FormikProvider value={formik}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

      </Stack>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        {year &&
          <ContentStyle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  disabled
                  {...getFieldProps('batch')}
                  error={Boolean(touched.batch && errors.batch)}
                  helperText={touched.batch && errors.batch}
                />
              </Grid>
            </Grid>
          </ContentStyle>
        }

        <Dialog
          buttonText={"Close"}
          openDialog={openDia}
          handleButton={handleClose}
        >
          Batch is added
        </Dialog >
        <LoadingFormButton loading={isSubmitting}>
          Add
        </LoadingFormButton>
        <ServerError open={serverError}>
          {serverError}
        </ServerError>
      </Form>
    </FormikProvider >
  );
};



