/*
	Imports
*/
import { Icon } from '@iconify/react';
import {
	IconButton, InputAdornment,
	Link, Stack,
	TextField
} from '@material-ui/core';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import ReactInputMask from 'react-input-mask';
import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import { LoginSchema, LoginSchemaStudent } from 'src/config/form-schemas';
import { CNICIcon, EmailIcon, HidePasswordIcon, PasswordIcon, ShowPasswordIcon } from 'src/config/icons';
import { RouteForgetPass } from 'src/config/routes';
import coordinatorService from 'src/services/CoordinatorService';
import studentService from 'src/services/StudentService';
import teacherService from 'src/services/TeacherService';
import palette from 'src/theme/palette';
import { Alert, Collapse } from '@mui/material';
import userService from 'src/services/UserService';

/*
	Main Working
*/
export default ({ }) => {
	/*
	  States, Params, Navigation, Query.
	*/
	const [serverError, setServerError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	/*
	  Form Setup
	*/
	const formik = useFormik({
		initialValues: {
			ID: '',
			Password: ''
		},
		validationSchema: LoginSchema,
		onSubmit: (values, { setSubmitting, setFieldError }) => {

			let funToCall = userService.login;

			funToCall(values.ID.replaceAll(' ', ''), values.Password)
				.then((_data) => {
					navigate(location.state?.from ? location.state.from : "../dashboard", { replace: true });
				})
				.catch((err) => {
					setSubmitting(false);
					if (!err.response) {
						if (err.message)
							setServerError(err.message);
						else
							setServerError('Error occured please try later');
					} else {
						setServerError('');
						setFieldError('Password', err.response.data.error.message);
					}
				});
		}
	});
	const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

	/*
	  Handlers
	*/

	const handleShowPassword = () => {
		setShowPassword((show) => !show);
	};

	/*
	  Use Effect Hooks.
	*/


	/*
	  Main Design
	*/
	return (

		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Stack spacing={3}>


					<TextField
						fullWidth
						autoComplete="username"
						type={'text'}
						label="Email"
						{...getFieldProps('ID')}
						InputProps={{

							startAdornment: (
								<InputAdornment position="start">
									<Icon icon={EmailIcon} inline="true" style={{ fontSize: 20 }} />
								</InputAdornment>
							)
						}}
						error={Boolean(touched.ID && errors.ID)}
						helperText={touched.ID && errors.ID}
					/>

					<br />

					<TextField
						fullWidth
						autoComplete="current-password"
						type={showPassword ? 'text' : 'password'}
						label="Password"
						{...getFieldProps('Password')}
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
						error={Boolean(touched.Password && errors.Password)}
						helperText={touched.Password && errors.Password}
					/>
					{!isSubmitting &&
						<Link
							component={RouterLink}
							color={palette.error.light}
							style={{ textDecoration: 'none', textAlign: 'right' }}
							variant="subtitle2"
							to={RouteForgetPass}
						>
							Forgot password?
						</Link>
					}

				</Stack>

				<br />

				<LoadingFormButton
					style={{ padding: '0px 70px' }}
					size="large"
					type="submit"
					variant="contained"
					loading={isSubmitting}
				>
					Login
				</LoadingFormButton>
				{serverError &&
					<Stack sx={{ width: '50%' }} marginTop={3}>
						<Collapse in={!!serverError}>
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
