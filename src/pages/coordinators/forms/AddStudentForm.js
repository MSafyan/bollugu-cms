/*
    Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';

import { Icon } from '@iconify/react';
import { Box, Button, CircularProgress, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DatePicker from '@material-ui/lab/DatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import ServerError from 'src/components/misc/alerts/ServerError';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import { provinces } from 'src/config/data';
import { AddStudentSchema } from 'src/config/form-schemas';
import { EmailIcon } from 'src/config/icons';
import studentService from 'src/services/StudentService';
import { acceptImageUpload, DefaultAvatar, defaultStudentPassword } from '../../../config/settings';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { MadrisaContext } from '../context/MadrisaContext';

/*
    Main Working
*/
export default ({ cities, sections, editing: edit_prop }) => {

    /*
        States, Params, Navigation, Query, Variables.
    */
    const [serverError, setServerError] = useState('');
    const [openDia, setOpenDia] = useState(false);
    const [openServerError, setOpenServerError] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageID, setImageID] = useState(null);
    const [editing, setEditing] = useState(edit_prop);
    const { madrisa, reload } = useContext(MadrisaContext);
    const batch = madrisa.batch;
    const [wrongFile, setWrongFile] = useState(false);

    const studentID = useParams().studentID || '';
    const sectionID = useParams().sID;

    const navigate = useNavigate();

    /*
        Form Setup
    */
    const formik = useFormik({
        initialValues: {
            name: '',
            contact: '',
            province: provinces[0],
            city: 2,
            gender: 'Male',
            email: '',
            section: sectionID,
            dob: new Date(),
            address: ''
        },
        validationSchema: AddStudentSchema,
        onSubmit: () => {
            addData();
        }
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting, handleBlur, setFieldError } = formik;

    /*
    Handlers
    */
    const addData = () => {
        const contact = {
            city: values.city,
            address: values.address,
            phone: values.contact
        };

        let FunctionToCall = studentService.addStudent;
        if (editing)
            FunctionToCall = studentService.update;

        FunctionToCall(values.section, values.name, values.email, contact, values.dob, values.gender, imageID, defaultStudentPassword, values.u_id, values.s_id)
            .then(() => {
                setOpenDia(true);
            })
            .catch((err) => {
                if (!studentID)
                    if (err.response) {
                        if (err.response.data.error.message == 'Email already taken')
                            setFieldError('email', 'Already taken');
                    }
                    else
                        setServerError('An Error Occured');
                setOpenServerError(true);
                setSubmitting(false);
            });
    };

    const handleClose = () => {
        reload();
        setOpenDia(false);
        navigate(-1);
    };

    const handleProvinceChange = () => {
        if (!cities) return;
        const c = (cities.find(city => city.province == values.province));
        setFieldValue('city', c ? c.id : 2);
    };

    const handleEditing = () => {
        if (editing && studentID) {
            studentService.find(studentID)
                .then((_student) => {
                    prefillData(_student);
                })
                .catch(() => {
                    navigate('/404');
                });
        }
    };

    function prefillData(student) {
        setFieldValue('u_id', student.u_id);
        setFieldValue('s_id', student.id);
        setFieldValue('email', student.email);
        setFieldValue('name', student.name);
        setFieldValue('contact', student.phone);
        setFieldValue('dob', student.dob);
        setFieldValue('gender', student.gender);
        setFieldValue('province', student.province);
        setFieldValue('city', student.city_id);
        setFieldValue('address', student.address);
        setFieldValue('section', student.section.id);
        setFieldValue('username', student.username);
        setImageID(student.imageID);
        setImageUrl(student.image || DefaultAvatar);
        if (student.section.batch.madrisa.id != madrisa.id) {
            setServerError("This email is already used by a student in another madrisa");
            setOpenServerError(true);
            return;
        }
        else {
            setOpenServerError(false);
        }
        setServerError("");
    }

    const handleImageChange = () => {
        setWrongFile(false);
        setImageUrl(null);
        if (selectedImage) {
            studentService.upload(selectedImage, !values.username ? `${madrisa.code}-${madrisa.batch.name}-${Math.random() * 10000 % 10000}` : values.username.replaceAll(' ', ''), null)
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

    const handleOldStudent = () => {
        if (values.email?.length < 7)
            return;
        studentService.searchMail(values.email, 0)
            .then((student) => {
                if (student.length < 1) {
                    setServerError("");
                    setEditing(false);
                    setOpenServerError(false);
                    return;
                }
                prefillData(student[0]);
                setEditing(true);
            })
            .catch((err) => {
                console.error('Something went wrong.', err);
            });

    };

    /*
        Use Effect Hooks.
    */
    useEffect(handleProvinceChange, [values.province]);
    useEffect(handleImageChange, [selectedImage]);
    useEffect(handleEditing, []);

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
                        {sections &&
                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel label="Sections">Sections</InputLabel>
                                </ThemeProvider>
                                <Select fullWidth
                                    {...getFieldProps('section')}
                                    // multiple
                                    error={Boolean(touched.section && errors.section)}
                                >
                                    {
                                        sections.map(row => (
                                            <MenuItem key={row.id} value={row.id}>{`${row.name}`}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Grid>
                        }

                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel>Name</InputLabel>
                            </ThemeProvider>
                            <TextField
                                fullWidth
                                autoComplete="currentName"
                                // disabled={alreadyRegistered}
                                // type={showPassword ? 'text' : 'password'}
                                // label="Name"
                                {...getFieldProps('name')}

                                error={Boolean(touched.name && errors.name)}
                                helperText={touched.name && errors.name}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>

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
                                // label="Contact Number"
                                format="####-#######"
                                allowEmptyFormatting="true"
                                // mask="_"
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
                                // disabled={alreadyRegistered}
                                {...getFieldProps('email')}
                                inputProps={{
                                    inputMode: 'email',
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon icon={EmailIcon} inline="true" style={{ fontSize: 20 }} />
                                        </InputAdornment>
                                    )
                                }}
                                onBlur={(prop) => { handleBlur(prop); handleOldStudent(); }}
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
                                //maxRows={4}
                                fullWidth
                                // autoComplete="current-email"
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
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel label="Address">Date Of Birth</InputLabel>
                            </ThemeProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={values.dob}
                                    maxDate={new Date()}
                                    // readOnly={true}
                                    onChange={(newValue) => {
                                        setFieldValue('dob', newValue);
                                    }}
                                    renderInput={(params) => <TextField

                                        fullWidth
                                        {...params}
                                        {...getFieldProps('dob')}

                                        error={Boolean(touched.dob && errors.dob)}
                                        helperText={touched.dob && errors.dob}
                                    />}
                                />
                            </LocalizationProvider>

                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel label="gender">Gender</InputLabel>
                            </ThemeProvider>

                            <Select fullWidth
                                // disabled={alreadyRegistered}
                                {...getFieldProps('gender')}
                                error={Boolean(touched.gender && errors.gender)}
                            >
                                <MenuItem key='Male' value='Male'>Male</MenuItem>
                                <MenuItem key='Female' value='Female'>Female</MenuItem>
                                <MenuItem key='Other' value='Other'>Other</MenuItem>
                            </Select>

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
                                    variant="outlined" color='primary' disabled={batch.blocked} component="span">
                                    Upload Image
                                </Button>
                            </label>
                            {(selectedImage || editing) && (
                                imageUrl ? <Box mt={2} textAlign="center">
                                    <img src={imageUrl} height="100px" />
                                </Box> :
                                    <Box mt={2} textAlign="center">
                                        <CircularProgress color="primary" />
                                    </Box>
                            )}

                        </Grid>
                    </Grid>
                </ContentStyle>

                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    {editing && studentID ? 'Student data updated' : `Student is added`}
                </Dialog>
                <AlertSnackbar severity="warning" open={wrongFile}>
                    Extension not allowed
                </AlertSnackbar>

                <LoadingFormButton disabled={batch.blocked || !!openServerError} loading={isSubmitting || ((selectedImage || editing) && !imageUrl)}>
                    {editing && studentID ? 'Save' : 'Add'}
                </LoadingFormButton>
                <ServerError open={serverError} collapse={openServerError}>
                    {serverError}
                </ServerError>
            </Form>
        </FormikProvider >
    );
};
