/*
    Imports:
        External Libraries
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';

/*
    Imports:
        Material UI
*/
import { Icon } from '@iconify/react';
import { Box, Button, CircularProgress, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DatePicker from '@material-ui/lab/DatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
/*
    Imports:
        Our Imports
        Components and Settings
        Services
*/
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import ServerError from 'src/components/misc/alerts/ServerError';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import { provinces, qualification } from 'src/config/data';
import { AddTeacherSchema } from 'src/config/form-schemas';
import { CNICIcon, EmailIcon } from 'src/config/icons';
import teacherService from 'src/services/TeacherService';
import { acceptImageUpload, DefaultAvatar, defaultTeacherPassword } from '../../../config/settings';
import userService from '../../../services/UserService';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
import { MadrisaContext } from '../context/MadrisaContext';

/*
    Main Working
*/
export default ({ cities, editing: edit_prop, reload }) => {

    /*
        States, Params, Navigation, Query, Variables.
    */
    const [serverError, setServerError] = useState('');
    const [openDia, setOpenDia] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageID, setImageID] = useState(null);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [editing, setEditing] = useState(edit_prop);
    const [wrongFile, setWrongFile] = useState(false);
    const teacherID = useParams().teacherID || '';
    const { madrisa } = useContext(MadrisaContext);

    const navigate = useNavigate();


    /*
        Form Setup
    */

    const initialValues = {
        name: '',
        ID: '' || teacherID,
        contact: '',
        province: provinces[0],
        city: 2,
        gender: 'Male',
        email: '',
        qualification: qualification[0],
        experience: 0,
        dob: new Date(),
        address: '',
        madrisa: madrisa.code,
        madrisa_ids: [],
        subjects: ''
    };
    const formik = useFormik({
        initialValues,
        validationSchema: AddTeacherSchema,
        onSubmit: () => {
            setSubmitting(true);
            values.ID.replaceAll(' ', '');
            addData(!alreadyRegistered);

        },
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting, setFieldError, resetForm } = formik;

    /*
    Handlers
    */

    const addData = (createUser) => {
        const ID = values.ID.replaceAll(' ', '');
        const contact = {
            city: values.city,
            address: values.address,
            phone: values.contact
        };

        let FunctionToCall = teacherService.addTeacher;
        if (editing)
            FunctionToCall = teacherService.update;


        const madrisa_ids = [...values.madrisa_ids];
        if (madrisa_ids.indexOf(madrisa.id) == -1)
            madrisa_ids.push(madrisa.id);

        FunctionToCall(createUser, ID, values.name, values.email, defaultTeacherPassword, values.dob, values.gender, values.qualification, values.experience, values.subjects, contact, madrisa_ids, imageID, values.u_id, values.t_id)
            .then(() => {
                setOpenDia(true);
            })
            .catch((err) => {
                if (!teacherID)
                    if (err.response) {
                        if (err.response.data.error.message == 'Email is already taken')
                            setFieldError('email', 'Already taken');
                    }
                    else
                        setServerError('An Error Occured');
                setSubmitting(false);
            }).finally();
    };

    const handleClose = () => {
        setOpenDia(false);
        reload();
        navigate(teacherID ? './../..' : './..');
    };

    const handleProvinceChange = () => {
        if (!cities) return;
        const c = (cities.find(city => city.province == values.province));
        setFieldValue('city', c ? c.id : 2);
    };

    const handleIDChange = () => {
        let ID = values.ID.replaceAll(' ', '');
        if (ID.length == 15) {
            setSubmitting(true);
            teacherService.find(ID)
                .then((teacher) => {
                    setFieldValue('u_id', teacher.u_id);
                    setFieldValue('t_id', teacher.id);
                    setFieldValue('ID', teacher.username);
                    setFieldValue('email', teacher.email);
                    setFieldValue('name', teacher.name);
                    setFieldValue('contact', teacher.phone);
                    setFieldValue('dob', teacher.dob);
                    setFieldValue('gender', teacher.gender);
                    setFieldValue('province', teacher.province);
                    setFieldValue('city', teacher.city_id);
                    setFieldValue('address', teacher.address);
                    setFieldValue('qualification', teacher.qualification);
                    setFieldValue('experience', teacher.experience);
                    setFieldValue('madrisa_ids', teacher.madrisa_ids);
                    setFieldValue('subjects', teacher.subjects);
                    setImageID(teacher.imageID);
                    setImageUrl(teacher.image || DefaultAvatar);
                    setEditing(true);
                    setAlreadyRegistered(true);
                })
                .catch(async (_err) => {
                    if (editing) {
                        navigate('/404');
                        return;
                    }
                    try {
                        const user = await userService.findUser(ID);

                        setFieldValue('u_id', user.u_id);
                        setFieldValue('ID', user.username);
                        setFieldValue('email', user.email);
                        setFieldValue('name', user.name);
                        setFieldValue('contact', user.phone);
                        setFieldValue('dob', user.dob);
                        setFieldValue('gender', user.gender);
                        setFieldValue('province', user.province);
                        setFieldValue('city', user.city_id);
                        setFieldValue('address', user.address);
                        setImageID(user.imageID);
                        setImageUrl(user.image || DefaultAvatar);
                        setAlreadyRegistered(true);
                    } catch (error) {
                        resetForm({ values: { ...initialValues, ID } });
                        setAlreadyRegistered(false);
                    } finally {
                        setEditing(false);
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
        }
    };

    const handleImageChange = () => {
        setWrongFile(false);
        setImageUrl(null);
        if (selectedImage) {
            teacherService.upload(selectedImage, values.ID.replaceAll(' ', ''), null)
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

    /*
        Use Effect Hooks.
    */
    useEffect(handleProvinceChange, [values.province]);
    useEffect(handleIDChange, [values.ID]);
    useEffect(handleImageChange, [selectedImage]);

    /*
        Main Design
    */
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                <Typography variant="h6" gutterBottom>
                    Personal Details
                </Typography>
                {madrisa.code &&
                    <ContentStyle>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel>Madrisa</InputLabel>
                                </ThemeProvider>
                                <TextField
                                    fullWidth
                                    disabled={true}
                                    value={madrisa.code}
                                />
                            </Grid>
                        </Grid>
                    </ContentStyle>
                }

                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel>CNIC</InputLabel>
                            </ThemeProvider>
                            <NumberFormat
                                fullWidth
                                customInput={TextField}
                                type="text"
                                format="#####-#######-#"
                                allowEmptyFormatting="true"

                                {...getFieldProps('ID')}
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon icon={CNICIcon} inline="true" style={{ fontSize: 20 }} />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={editing}
                                error={Boolean(touched.ID && errors.ID)}
                                helperText={touched.ID && errors.ID}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel>Name</InputLabel>
                            </ThemeProvider>
                            <TextField
                                fullWidth
                                autoComplete="currentName"
                                disabled={alreadyRegistered}
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
                                disabled={alreadyRegistered}
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
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel label="Address">Date Of Birth</InputLabel>
                            </ThemeProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={values.dob}
                                    disabled={alreadyRegistered}
                                    maxDate={new Date()}
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
                                disabled={alreadyRegistered}
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
                                disabled={values.ID.length != 15 || editing}
                                accept={acceptImageUpload}
                                type="file"
                                id="select-image"
                                style={{ display: 'none' }}
                                onChange={e => setSelectedImage(e.target.files[0])}
                            />
                            <label htmlFor="select-image">
                                <Button
                                    disabled={values.ID.replaceAll(' ', '').length != 15 || editing}
                                    variant="outlined" color='primary' component="span">
                                    Upload Image
                                </Button>
                            </label>
                            {(selectedImage || editing || alreadyRegistered) && (
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

                <Typography variant="h6" marginTop={4}>
                    Professional Details
                </Typography>

                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel>Qualification</InputLabel>
                            </ThemeProvider>
                            <Select
                                fullWidth
                                {...getFieldProps('qualification')}
                                error={Boolean(touched.qualification && errors.qualification)}
                            >
                                {
                                    qualification.map(row => (
                                        <MenuItem key={row} value={row}>{row.replaceAll('_', ' ')}</MenuItem>
                                    ))
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel>Experience (Years)</InputLabel>
                            </ThemeProvider>
                            <TextField
                                fullWidth
                                type="number"
                                inputProps={{ type: 'number', inputMode: 'numeric', min: 0 }}
                                {...getFieldProps('experience')}
                                error={Boolean(touched.experience && errors.experience)}
                                helperText={touched.experience && errors.experience}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel>Subjects</InputLabel>
                            </ThemeProvider>
                            <TextField
                                fullWidth
                                autoComplete="subjects"
                                {...getFieldProps('subjects')}
                                error={Boolean(touched.subjects && errors.subjects)}
                                helperText={touched.subjects && errors.subjects}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>

                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    {editing && values.madrisa_ids.indexOf(madrisa.id) != -1 ? 'Teacher data updated' : `Teacher is added`}
                </Dialog>
                <AlertSnackbar severity="warning" open={wrongFile}>
                    Extension not allowed
                </AlertSnackbar>

                <LoadingFormButton loading={isSubmitting || ((selectedImage || editing) && !imageUrl)}>
                    {editing && values.madrisa_ids.indexOf(madrisa.id) != -1 ? 'Save' : 'Add'}
                </LoadingFormButton>
                <ServerError open={serverError}>
                    {serverError}
                </ServerError>
            </Form>
        </FormikProvider >
    );
};

