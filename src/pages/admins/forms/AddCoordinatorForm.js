/*
	Imports
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';

/*
	Imports:
		Material UI
*/
import { Icon } from '@iconify/react';
import { Box, Button, Chip, CircularProgress, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
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
import { provinces } from 'src/config/data';
import { AddCoordinatorSchema } from 'src/config/form-schemas';
import { CNICIcon, EmailIcon } from 'src/config/icons';
import { RouteCoordinators } from 'src/config/routes';
import coordinatorService from 'src/services/CoordinatorService';
import notificationService from 'src/services/NotificationService';
import { acceptImageUpload, DefaultAvatar, defaultCoordinatortPassword } from '../../../config/settings';
import userService from '../../../services/UserService';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';


/*
	Main Working
*/
export default ({ madaris, cities, editing: edit_prop }) => {

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


	const coordinatorID = useParams().coordinatorID;

	const navigate = useNavigate();

	/*
		Form Setup
	*/
	const formik = useFormik({
		initialValues: {
			name: '',
			ID: coordinatorID ?? '',
			contact: '',
			Madaris: [madaris[0].id],
			province: provinces[0],
			city: 2,
			gender: 'Male',
			email: '',
			experience: '',
			qualification: '',
			dob: new Date(),
			address: '',
			O_Madaris: [],
		},
		validationSchema: AddCoordinatorSchema,
		onSubmit: (_values, { setFieldError }) => {
			setSubmitting(true);
			let ID = values.ID.replaceAll(' ', '');
			if (!alreadyRegistered || editing) {
				addData(true);
			}
			else {
				coordinatorService
					.coordinatorDoesNotExist(ID)
					.then(addData)
					.catch((_error) => {
						setServerError('');
						setFieldError('ID', 'Already added');
					});
			}
		}
	});

	const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting, resetForm, initialValues } = formik;

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

		let FunctionToCall = coordinatorService.addCoordinator;
		if (editing)
			FunctionToCall = coordinatorService.update;

		FunctionToCall(createUser, ID, values.name, values.email, defaultCoordinatortPassword, values.dob, values.gender, values.Madaris, values.qualification, values.experience, contact, imageID, values.u_id, values.c_id)
			.then((coordinator) => {
				values.Madaris.forEach((value) => {
					if (!values.O_Madaris.includes(value)) {
						const m = madaris.find(element => element.id == value);
						notificationService.addCoordinator(coordinator.id, m.name, "has been assigned to you", `/coordinator/madaris/${m.code}`);
					}
				});

				values.O_Madaris.forEach((value) => {
					if (!values.Madaris.includes(value)) {
						const m = madaris.find(element => element.id == value);
						notificationService.addCoordinator(coordinator.id, m.name, "has been removed from you", `#`);
					}
				});

				setOpenDia(true);
			})
			.catch((err) => {
				if (!coordinatorID)
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
		navigate(RouteCoordinators);
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
			coordinatorService.find(ID)
				.then((coordinator) => {
					setFieldValue('u_id', coordinator.u_id);
					setFieldValue('c_id', coordinator.id);
					setFieldValue('ID', coordinator.username);
					setFieldValue('email', coordinator.email);
					setFieldValue('name', coordinator.name);

					setFieldValue('contact', coordinator.phone);
					setFieldValue('dob', coordinator.dob);
					setFieldValue('gender', coordinator.gender);
					if (coordinator.province)
						setFieldValue('province', coordinator.province);
					if (coordinator.city_id)
						setFieldValue('city', coordinator.city_id);
					setFieldValue('address', coordinator.address);
					setFieldValue('qualification', coordinator.qualification);
					setFieldValue('experience', coordinator.experience);
					setFieldValue('Madaris', coordinator.madrisa_id);
					setFieldValue('O_Madaris', coordinator.madrisa_id);
					setImageID(coordinator.imageID);
					setImageUrl(coordinator.image || DefaultAvatar);
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
				}).finally(() => {
					setSubmitting(false);
				});
		}

	};

	const handleImageChange = () => {
		setWrongFile(false);
		setImageUrl(null);
		if (selectedImage) {
			coordinatorService.upload(selectedImage, values.ID.replaceAll(' ', ''), null)
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
								disabled={values.ID.length != 15}
								accept={acceptImageUpload}
								type="file"
								id="select-image"
								style={{ display: 'none' }}
								onChange={e => setSelectedImage(e.target.files[0])}
							/>
							<label htmlFor="select-image">
								<Button
									disabled={values.ID.replaceAll(' ', '').length != 15}
									variant="outlined" color='primary' component="span">
									Upload Image
								</Button>
							</label>
							{(imageUrl || editing) && (
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
							<TextField
								fullWidth
								{...getFieldProps('qualification')}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Icon inline="true" style={{ fontSize: 25 }} />
										</InputAdornment>
									)
								}}
								error={Boolean(touched.qualification && errors.qualification)}
								helperText={touched.qualification && errors.qualification}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Experience</InputLabel>
							</ThemeProvider>
							<TextField
								fullWidth
								{...getFieldProps('experience')}
								error={Boolean(touched.experience && errors.experience)}
								helperText={touched.experience && errors.experience}
							/>
						</Grid>
					</Grid>
				</ContentStyle>

				<Typography variant="h6" marginTop={4}>
					Select Madaris
				</Typography>

				{madaris &&
					<ContentStyle>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={6}>
								<ThemeProvider theme={FormTheme}>
									<InputLabel label="Madaris">Madaris</InputLabel>
								</ThemeProvider>
								<Select fullWidth
									{...getFieldProps('Madaris')}
									multiple
									error={Boolean(touched.Madaris && errors.Madaris)}
									renderValue={(selected) => (
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
											{selected.map((value) => (
												<Chip key={value} label={(madaris.find(element => element.id == value).code)} />
											))}
										</Box>
									)}
								>
									{
										madaris.map(row => (
											<MenuItem key={row.id} value={row.id}>{`${row.name} - ${row.code}`}</MenuItem>
										))
									}
								</Select>
							</Grid>
						</Grid>
					</ContentStyle>}

				<Dialog
					buttonText={"Close"}
					openDialog={openDia}
					handleButton={handleClose}
				>
					{editing ? 'Co-ordinator data updated' : `Co-ordinator is added`}
				</Dialog>
				<AlertSnackbar severity="warning" open={wrongFile}>
					Extenstion not allowed
				</AlertSnackbar>

				<LoadingFormButton loading={isSubmitting || ((selectedImage || editing) && !imageUrl)}>
					{editing ? 'Save' : 'Add'}
				</LoadingFormButton>
				<ServerError open={serverError}>
					{serverError}
				</ServerError>
			</Form>
		</FormikProvider >
	);
};

