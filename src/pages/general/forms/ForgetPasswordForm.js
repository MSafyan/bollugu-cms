/*
	Imports
*/
import { Icon } from '@iconify/react';
import {
	InputAdornment, Stack,
	TextField
} from '@material-ui/core';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { ForgetSchema } from 'src/config/form-schemas';
import { EmailIcon } from 'src/config/icons';
import userService from '../../../services/UserService';


/*
	Main Working
*/
export default () => {
	/*
		States, Params, Navigation, Query.
	*/
	const [serverError, setServerError] = useState('');
	const [emailSent, setEmailSent] = useState(false);
	const [openDia, setOpenDia] = useState(false);

	/*
		Form Setup
	*/
	const formik = useFormik({
		initialValues: {
			ID: ''
		},
		validationSchema: ForgetSchema,
		onSubmit: (values, { setSubmitting, setFieldError }) => {
			setServerError('');
			userService.
				forgetPassword(values.ID)
				.then(() => {
					setEmailSent(values.ID);
					setOpenDia(true);
				})
				.catch((err) => {
					if (err.response.data.error.status === 400)
						setFieldError('ID', err.response.data.error.message);
					else
						setServerError('An Error Occured');
				})
				.finally(() => setSubmitting(false));
		}
	});
	const { errors, touched, isSubmitting, handleSubmit, getFieldProps, resetForm } = formik;

	/*
		Handlers
	*/
	const handleClose = () => {
		resetForm();
		setOpenDia(false);
	};

	/*
		Main Design
	*/
	return (

		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Stack spacing={3}>
					<TextField
						type="email"
						label="E-MAIL"
						{...getFieldProps('ID')}
						inputProps={{
							inputMode: 'email',
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Icon
										icon={EmailIcon}
										inline="true"
										style={{ fontSize: 25 }}
									/>
								</InputAdornment>
							)
						}}
						error={Boolean(touched.ID && errors.ID)}
						helperText={touched.ID && errors.ID}
					/>
				</Stack>

				<br />
				<Dialog
					buttonText={"Close"}
					openDialog={openDia}
					handleButton={handleClose}
				>
					{`A link is sent to ${emailSent}`}
				</Dialog >

				<LoadingFormButton loading={isSubmitting}>
					Send Mail
				</LoadingFormButton>

				{serverError &&
					<Stack sx={{ width: '50%' }} marginTop={3}>
						<Collapse in={openServerError}>
							<Alert severity="error">
								{serverError}
							</Alert>
						</Collapse>
					</Stack>
				}
			</Form>
		</FormikProvider>

	);
};
