/*
	Imports
*/
import { Icon } from '@iconify/react';
import {
	IconButton, InputAdornment, Stack,
	TextField
} from '@material-ui/core';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dialog from 'src/components/misc/alerts/Dialog';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { ResetSchema } from 'src/config/form-schemas';
import { HidePasswordIcon, PasswordIcon, ShowPasswordIcon } from 'src/config/icons';
import { RouteLogin } from 'src/config/routes';
import userService from '../../../services/UserService';

/*
	Main Working
*/
export default () => {
	/*
		States, Params, Navigation, Query.
	*/
	const [searchParams, _setSearchParams] = useSearchParams();
	const [password, setPassword] = useState('');
	const [serverError, setServerError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [openDia, setOpenDia] = useState(false);

	const navigate = useNavigate();
	const code = searchParams.get('code');

	/*
		Form Setup
	*/
	const formik = useFormik({
		initialValues: {
			password: '',
			confirm: '',
			code
		},
		validationSchema: ResetSchema(password),
		onSubmit: (_values, { setSubmitting, setFieldError }) => {
			setServerError('');
			userService
				.resetPassword(_values.password, code)
				.then(() => {
					setOpenDia(true);
				})
				.catch((err) => {
					if (err.response.data.error.status === 400)
						setFieldError('code', err.response.data.error.message);
					else
						setServerError('An Error Occured');
				})
				.finally(() => setSubmitting(false));
		}
	});
	const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, resetForm } = formik;

	/*
		Handlers
	*/

	const handleClose = () => {
		resetForm();
		setOpenDia(false);
		navigate(RouteLogin);
	};

	const handleShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const handlePasswordUpdate = () => {
		setPassword(values.password);
	};

	/*
		Use Effect Hooks.
	*/

	useEffect(handlePasswordUpdate, [values.password]);

	/*
		Main Design
	*/
	return (

		<FormikProvider value={formik}>
			<Form noValidate onSubmit={handleSubmit}>
				<Stack spacing={3}>
					<TextField
						fullWidth
						type={showPassword ? 'text' : 'password'}
						label="New Password"
						{...getFieldProps('password')}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={handleShowPassword} edge="end">
										<Icon icon={showPassword ? HidePasswordIcon : ShowPasswordIcon} />
									</IconButton>
								</InputAdornment>
							),
							startAdornment: (
								<InputAdornment position="start">
									<Icon icon={PasswordIcon} inline="true" style={{ fontSize: 20 }} />
								</InputAdornment>
							)
						}}
						error={Boolean(touched.password && errors.password)}
						helperText={touched.password && errors.password}

					/>
					<br />
					<TextField
						fullWidth
						type={showPassword ? 'text' : 'password'}
						label="Confirm Password"
						{...getFieldProps('confirm')}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={handleShowPassword} edge="end">
										<Icon icon={showPassword ? HidePasswordIcon : ShowPasswordIcon} />
									</IconButton>
								</InputAdornment>
							),
							startAdornment: (
								<InputAdornment position="start">
									<Icon icon={PasswordIcon} inline="true" style={{ fontSize: 20 }} />
								</InputAdornment>
							)
						}}
						error={Boolean(touched.confirm && errors.confirm)}
						helperText={touched.confirm && errors.confirm}
					/>

					<br />
					<TextField
						fullWidth
						disabled
						label="Reset Code"
						{...getFieldProps('code')}
						InputProps={{
							startAdornment: <InputAdornment position="start"></InputAdornment>
						}}
						error={Boolean(touched.code && errors.code)}
						helperText={touched.code && errors.code}
					/>
				</Stack>

				<br />
				<br />

				<Dialog
					buttonText={"Close"}
					openDialog={openDia}
					handleButton={handleClose}
				>
					Password changed successfully, you may login with new password now.
				</Dialog >

				<LoadingFormButton loading={isSubmitting}>
					Reset
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
