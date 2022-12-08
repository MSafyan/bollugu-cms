/*
		Imports:
				External Libraries
*/
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useNavigate } from 'react-router-dom';

/*
		Imports:
				Material UI
				Icons
*/

import { Icon } from '@iconify/react';
import { Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@material-ui/core';
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
import { AddFeeSchema } from 'src/config/form-schemas';
import { RupeeIcon } from 'src/config/icons';
import { RouteAdminFee } from 'src/config/routes';
import FeeService from 'src/services/FeeService';
import MadrisaService from 'src/services/MadrisaService';
import notificationService from 'src/services/NotificationService';


/*
		Main Working
*/
export default ({ madaris }) => {

	/*
			States, Params, Navigation, Query, Variables.
	*/
	const [serverError, setServerError] = useState('');
	const [openDia, setOpenDia] = useState(false);

	const navigate = useNavigate();

	/*
			Form Setup
	*/

	const formik = useFormik({
		initialValues: {
			Madaris: 0,
			amount: 0,
			totalAmount: 0
		},
		validationSchema: AddFeeSchema,
		onSubmit: () => {
			addData();
		}
	});

	const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting } = formik;

	/*
			Handlers
	*/

	const addData = () => {
		FeeService.addFee(values.Madaris, values.batchID, values.totalAmount)
			.then(() => {
				const madrisa = madaris?.find((m) => m.id == values.Madaris);
				for (const coordinator of madrisa.coordinatorIds) {
					notificationService.addCoordinator(coordinator, madrisa.name, "has new fee bill", `/coordinator/fee`);
				}
				setOpenDia(true);
			})
			.catch(() => {
				setServerError('An Error Occured');
			}).finally(() => {
				setSubmitting(false);
			});
	};

	const handleClose = () => {
		setOpenDia(false);
		navigate(RouteAdminFee);
	};

	const countStudents = () => {
		if (!values.Madaris)
			return 0;
		MadrisaService
			.getOne(values.Madaris)
			.then((madrisa) => {
				let students = 0;
				if (madrisa.batches.length > 0) {
					const batch = madrisa.batches[madrisa.batches.length - 1];
					for (const element of batch.sections) {
						const section = element;
						students += section.students.length;
					}
					setFieldValue('totalStudents', students);
					setFieldValue('batch', batch.year);
					setFieldValue('batchID', batch.id);
				}
			});
	};

	const countTotalAmount = () => {
		setFieldValue('totalAmount', values.amount * values.totalStudents);
	};

	useEffect(countStudents, [values.Madaris]);
	useEffect(countTotalAmount, [values.amount]);


	/*
			Main Design
	*/
	return (
		<FormikProvider value={formik}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
				<Typography variant="h4" gutterBottom>
					Add Fee
				</Typography>
			</Stack>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>

				<Typography variant="h6" gutterBottom>
					Select Madrisa
				</Typography>

				{madaris &&
					<ContentStyle>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={6}>
								<ThemeProvider theme={FormTheme}>
									<InputLabel label="Madaris">Madrisa</InputLabel>
								</ThemeProvider>
								<Select fullWidth
									{...getFieldProps('Madaris')}
									error={Boolean(touched.Madaris && errors.Madaris)}
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

				<ContentStyle>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Students</InputLabel>
							</ThemeProvider>
							<NumberFormat
								fullWidth
								disabled
								customInput={TextField}
								type="text"
								allowEmptyFormatting="true"
								{...getFieldProps('totalStudents')}

								error={Boolean(touched.totalStudents && errors.totalStudents)}
								helperText={touched.totalStudents && errors.totalStudents}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Batch</InputLabel>
							</ThemeProvider>
							<NumberFormat
								fullWidth
								disabled
								customInput={TextField}
								type="text"
								allowEmptyFormatting="true"
								{...getFieldProps('batch')}

								error={Boolean(touched.batch && errors.batch)}
								helperText={touched.batch && errors.batch}
							/>
						</Grid>
					</Grid>
				</ContentStyle>


				<Typography variant="h6" gutterBottom style={{ marginTop: 30 }}>
					Add Fee Per Student
				</Typography>

				<ContentStyle>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Fee</InputLabel>
							</ThemeProvider>
							<NumberFormat
								fullWidth
								customInput={TextField}
								type="text"
								allowEmptyFormatting="true"
								inputProps={{
									inputMode: 'numeric',
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Icon icon={RupeeIcon} inline="true" style={{ fontSize: 25 }} />
										</InputAdornment>
									)
								}}
								{...getFieldProps('amount')}

								error={Boolean(touched.amount && errors.amount)}
								helperText={touched.amount && errors.amount}
							/>
						</Grid>
					</Grid>
				</ContentStyle>


				<ContentStyle>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Total Fee</InputLabel>
							</ThemeProvider>
							<NumberFormat
								fullWidth
								disabled
								customInput={TextField}
								type="text"
								allowEmptyFormatting="true"
								{...getFieldProps('totalAmount')}

								error={Boolean(touched.totalAmount && errors.totalAmount)}
								helperText={touched.totalAmount && errors.totalAmount}
							/>
						</Grid>
					</Grid>
				</ContentStyle>

				<Dialog
					buttonText={"Close"}
					openDialog={openDia}
					handleButton={handleClose}
				>
					Fee is added
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

