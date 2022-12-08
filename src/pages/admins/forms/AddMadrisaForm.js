/*
		Imports:
				External Libraries
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';

/*
		Imports:
				Material UI
				Icons
*/

import { Icon } from '@iconify/react';
import { Box, Chip, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

/*
		Imports:
				Our Imports
				Components and Settings
*/
import Dialog from 'src/components/misc/alerts/Dialog';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';
/*
		Imports:
				Our Imports
				Services
*/
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import ServerError from 'src/components/misc/alerts/ServerError';
import { provinces } from 'src/config/data';
import { AddMadrisaSchema } from 'src/config/form-schemas';
import { RouteMadaris } from 'src/config/routes';
import MadrisaService from 'src/services/MadrisaService';
import notificationService from 'src/services/NotificationService';


/*
		Main Working
*/
export default ({ coordinators, cities, editing }) => {

	/*
			States, Params, Navigation, Query, Variables.
	*/
	const [serverError, setServerError] = useState('');
	const [openDia, setOpenDia] = useState(false);

	const navigate = useNavigate();

	const madrisaID = useParams().mid;

	/*
			Form Setup
	*/

	const formik = useFormik({
		initialValues: {
			name: '',
			code: '',
			contact: '',
			Coordinators: [],
			province: provinces[0],
			city: 2,
			address: '',
			Coordinators_o: []
		},
		validationSchema: AddMadrisaSchema,
		onSubmit: () => {
			addData();
		}
	});

	const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting, setFieldError } = formik;

	/*
			Handlers
	*/

	const addData = () => {
		const contact = {
			city: values.city,
			address: values.address,
			phone: values.contact
		};

		let codeUpper = values.code.toUpperCase();

		let FunctionToCall = MadrisaService.addMadrassa;
		if (madrisaID)
			FunctionToCall = MadrisaService.update;

		FunctionToCall(codeUpper, values.name, contact, values.Coordinators, madrisaID)
			.then(() => {
				setOpenDia(true);
				values.Coordinators.forEach((value) => {
					if (!values.Coordinators_o.includes(value)) {
						notificationService.addCoordinator(value, values.name, "has been assigned to you", `/coordinator/madaris/${codeUpper}`);
					}
				});

				values.Coordinators_o.forEach((value) => {
					if (!values.Coordinators.includes(value)) {
						notificationService.addCoordinator(value, values.name, "has been removed from you", `#`);
					}
				});
			})
			.catch((err) => {
				console.error('Error in edit Madrisa', err);
				if (err.response) {
					if (err.response.data.error.status === 400)
						setFieldError('code', 'Already taken');
				}
				else
					setServerError('An Error Occured');

			}).finally(() => {
				setSubmitting(false);
			});
	};

	const handleProvinceChange = () => {
		if (!cities) return;
		setFieldValue('city', (cities.find(city => city.province == values.province)).id);
	};

	const handleClose = () => {
		setOpenDia(false);
		navigate(RouteMadaris);
	};

	const handleEditing = () => {
		if (editing) {
			MadrisaService.getOne(madrisaID)
				.then((data) => {
					setFieldValue('code', data.code);
					setFieldValue('name', data.name);
					setFieldValue('contact', data.phone);
					setFieldValue('city', data.city_id);
					setFieldValue('province', data.province);
					setFieldValue('address', data.address);
					setFieldValue('Coordinators', data.coordinatorIds);
					setFieldValue('Coordinators_o', data.coordinatorIds);
				})
				.catch(() => {
					navigate('/404');
				});
		}
	};

	/*
		 Use Effect Hooks.
 */
	useEffect(handleProvinceChange, [values.province]);
	useEffect(handleEditing, []);

	/*
			Main Design
	*/
	return (
		<FormikProvider value={formik}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
				<Typography variant="h4" gutterBottom>
					{editing ? `Edit` : `Add`} Madrisa
				</Typography>
			</Stack>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>

				<Typography variant="h6" gutterBottom>
					Madrisa Details
				</Typography>

				<ContentStyle>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Code</InputLabel>
							</ThemeProvider>
							<TextField
								inputProps={{ maxLength: 3, style: { textTransform: "uppercase" } }}
								fullWidth
								disabled={editing}
								{...getFieldProps('code')}
								error={Boolean(touched.code && errors.code)}
								helperText={touched.code && errors.code}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Name</InputLabel>
							</ThemeProvider>
							<TextField
								fullWidth
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


				<Typography variant="h6" marginTop={4}>
					Select Coordinator
				</Typography>
				{coordinators &&
					<ContentStyle>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={6}>
								<ThemeProvider theme={FormTheme}>
									<InputLabel label="Madaris">Coordinators</InputLabel>
								</ThemeProvider>
								<Select fullWidth
									{...getFieldProps('Coordinators')}
									multiple
									error={Boolean(touched.Coordinators && errors.Coordinators)}
									renderValue={(selected) => (
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
											{selected.map((value) => (
												<Chip key={value} label={(coordinators.find(element => element.id == value).name)} />
											))}
										</Box>
									)}
								>
									{
										coordinators.map(row => (
											<MenuItem key={row.id} value={row.id}>{`${row.name} - ${row.username}`}</MenuItem>
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
					Madrisa is {editing ? `updated` : `added`}
				</Dialog >


				<LoadingFormButton loading={isSubmitting}>
					{editing ? `Save` : `Add`}
				</LoadingFormButton>
				<ServerError open={serverError}>
					{serverError}
				</ServerError>
			</Form>
		</FormikProvider >
	);
};

