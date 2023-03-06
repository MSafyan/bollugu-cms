import useSectionHook from 'src/services/useSectionHook';
import useLayouts from '../../../services/useLayoutHook';
import { ThemeProvider } from '@material-ui/styles';
import {
  Box,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { PRIMARY } from 'src/theme/palette';
import {
  imagePositions,
  TemplateHas,
  templateTypes,
  textPositions,
  YesNo
} from 'src/config/settings';
import { FormTheme } from 'src/theme/form-pages';
import { useState } from 'react';

export const SelectTemplateLayout = ({
  values,
  fieldName,
  label,
  getFieldProps,
  touched,
  errors,
  setFieldValue
}) => {
  const { layouts, layoutsLoading } = useLayouts();
  const [selectedNote, setSelectedNote] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState(null);

  if (layoutsLoading) return <CircularProgress />;
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
                  var obj = TemplateHas?.[_?.name].actions;
                  var note = TemplateHas?.[_?.name]?.note;

                  setFieldValue(fieldName, _.name);
                  setSelectedLayout(_.id);
                  setSelectedNote(note);
                  console.log(note);

                  Object.keys(obj)?.forEach((key) => {
                    setFieldValue(key, obj[key]);
                  });
                }}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.500',
                  borderRadius: '5px',
                  padding: 1,
                  width: '140px',
                  cursor: 'pointer',
                  ...(values?.[fieldName] === _?.id && {
                    backgroundColor: PRIMARY?.main
                  })
                }}
                error={Boolean(touched[fieldName] && errors[fieldName])}
                helperText={touched[fieldName] && errors[fieldName]}
              >
                <img src={_.image?.url} alt="1" width="100%" height="100%" />
              </Box>
              {selectedLayout == _?.id && <Typography>{selectedNote}</Typography>}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
export const SelectSection = ({
  values,
  fieldName,
  label,
  getFieldProps,
  touched,
  errors,
  setFieldValue
}) => {
  const { sections } = useSectionHook();
  return (
    <Box
      sx={{
        mt: 2
      }}
    >
      <ThemeProvider theme={FormTheme}>
        <InputLabel>{label}</InputLabel>
      </ThemeProvider>
      <Select
        fullWidth
        {...getFieldProps(fieldName)}
        error={Boolean(touched[fieldName] && errors[fieldName])}
        helperText={touched[fieldName] && errors[fieldName]}
      >
        {sections.map((row) => {
          return (
            <MenuItem key={row.id} value={row.id}>
              {row.url || ''}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export const SelectPosition = ({ getFieldProps, fieldName, label, touched, errors }) => {
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
        {textPositions.map((row) => {
          return (
            <MenuItem key={row} value={row}>
              {row || ''}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};
export const SelectTemplate = ({ getFieldProps, fieldName, label, touched, errors }) => {
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
        {templateTypes.map((row) => {
          return (
            <MenuItem key={row} value={row}>
              {row || ''}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};

export const SelectImagePosition = ({ getFieldProps, fieldName, label, touched, errors }) => {
  return (
    <>
      <ThemeProvider theme={FormTheme}>
        <InputLabel>{label}</InputLabel>
      </ThemeProvider>
      <Select fullWidth {...getFieldProps(fieldName)}>
        {imagePositions.map((row) => {
          return (
            <MenuItem key={row} value={row}>
              {row || ''}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};

export const SelectYesNo = ({ getFieldProps, fieldName, label, touched, errors }) => {
  return (
    <>
      <ThemeProvider theme={FormTheme}>
        <InputLabel>{label}</InputLabel>
      </ThemeProvider>
      <Select
        fullWidth
        {...getFieldProps(fieldName)}
        error={Boolean(touched.display_on_home_page && errors.display_on_home_page)}
        helperText={touched.display_on_home_page && errors.display_on_home_page}
      >
        {YesNo.map((row) => {
          return (
            <MenuItem key={row} value={row}>
              {row || ''}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};
