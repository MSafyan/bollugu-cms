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
import { Icon } from '@iconify/react';
import { Box, Button, Chip, CircularProgress, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
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
import { CurrencyIcon } from 'src/config/icons';
import { RouteMenu } from 'src/config/routes';
import menuService from 'src/services/MenuServiceClass';
import { acceptImageUpload, Days } from '../../../config/settings';
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
	const [imageUrl, setImageUrl] = useState(menuItem?.image?.url);
	const [imageID, setImageID] = useState(menuItem?.image?.id);
	const [wrongFile, setWrongFile] = useState(false);

	const navigate = useNavigate();

	/*
		Form Setup
	*/
	const formik = useFormik({
		initialValues: {
			name: menuItem?.name ?? '',
			description: menuItem?.description ?? '',
			ingredients: menuItem?.ingredients ?? '',
			price: +(menuItem?.price ?? 0),
			availability: menuItem?.availability ? Days.filter((d, i) => menuItem.availability[i]) : [],
		},
		validationSchema: AddMenuItemSchema,
		onSubmit: (_values, { setFieldError }) => {
			setSubmitting(true);
			addData();
		}
	});

	const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting, resetForm, initialValues } = formik;

	/*
		Handlers
	*/
	const addData = () => {

		let FunctionToCall = menuService.add;
		if (editing)
			FunctionToCall = menuService.update;

		const data = {
			...values,
			availability: Days.map((day) => values.availability.includes(day)),
			image: imageID,
			price: `${values.price}`,
			chef: 1
		}

		FunctionToCall(data, menuItem?.id)
			.then((_menuItem) => {
				setOpenDia(true);
			})
			.catch((err) => {

				setServerError('An Error Occured');
				setSubmitting(false);
			}).finally();
	};

	const handleClose = () => {
		setOpenDia(false);
		navigate(RouteMenu);
	};

	const handleImageChange = () => {
		setWrongFile(false);
		setImageUrl(null);
		if (selectedImage) {
			menuService.upload(selectedImage, values.name, null)
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
					Menu Item Details
				</Typography>

				<ContentStyle>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Name</InputLabel>
							</ThemeProvider>
							<TextField
								fullWidth
								autoComplete="name"
								{...getFieldProps('name')}
								inputProps={{
									inputMode: 'name',
								}}
								error={Boolean(touched.name && errors.name)}
								helperText={touched.name && errors.name}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Price</InputLabel>
							</ThemeProvider>
							<TextField
								fullWidth
								autoComplete="price"
								{...getFieldProps('price')}
								inputProps={{
									inputMode: 'decimal',
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Icon icon={CurrencyIcon} inline="true" style={{ fontSize: 20 }} />
										</InputAdornment>
									)
								}}
								error={Boolean(touched.price && errors.price)}
								helperText={touched.price && errors.price}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Description</InputLabel>
							</ThemeProvider>
							<TextField
								fullWidth
								multiline
								minRows={3}
								autoComplete="description"
								{...getFieldProps('description')}
								error={Boolean(touched.description && errors.description)}
								helperText={touched.description && errors.description}
							/>
						</Grid>

						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Ingredients</InputLabel>
							</ThemeProvider>
							<TextField
								fullWidth
								multiline
								minRows={3}
								autoComplete="ingredients"
								{...getFieldProps('ingredients')}
								type="textbox"
								error={Boolean(touched.ingredients && errors.ingredients)}
								helperText={touched.ingredients && errors.ingredients}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Availability</InputLabel>
							</ThemeProvider>
							<Select fullWidth
								{...getFieldProps('availability')}
								multiple
								renderValue={(selected) => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
										{selected.map((value) => (
											<Chip key={value} label={value} />
										))}
									</Box>
								)}
								error={Boolean(touched.availability && errors.availability)}
								helperText={touched.availability && errors.availability}
							>
								{
									Days.map(row => (
										<MenuItem key={row} value={row}>{row}</MenuItem>
									))
								}
							</Select>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>

							<input
								disabled={values.name.length < 2}
								accept={acceptImageUpload}
								type="file"
								id="select-image"
								style={{ display: 'none' }}
								onChange={e => setSelectedImage(e.target.files[0])}
							/>
							<label htmlFor="select-image">
								<Button
									disabled={values.name.length < 2}
									variant="outlined" color='primary' component="span">
									Upload Image
								</Button>
							</label>
							{(imageUrl) && (
								imageUrl ? <Box mt={2} textAlign="center">
									<img src={imageUrl} alt={values.name} height="100px" />
								</Box> :
									<Box mt={2} textAlign="center">
										<CircularProgress color="primary" />
									</Box>
							)}

						</Grid>

					</Grid>
				</ContentStyle>

				<ContentStyle>
					<Grid container spacing={3}>

					</Grid>
				</ContentStyle>


				<Dialog
					buttonText={"Close"}
					openDialog={openDia}
					handleButton={handleClose}
				>
					{editing ? 'Menu item updated' : `Menu item is added`}
				</Dialog>
				<AlertSnackbar severity="warning" open={wrongFile}>
					File type not allowed
				</AlertSnackbar>

				<LoadingFormButton loading={isSubmitting || ((selectedImage) && !imageUrl)}>
					{editing ? 'Save' : 'Add'}
				</LoadingFormButton>
				<ServerError open={serverError || !!errors.availability}>
					{serverError ? serverError : errors.availability}
				</ServerError>
			</Form>
		</FormikProvider >
	);
};

