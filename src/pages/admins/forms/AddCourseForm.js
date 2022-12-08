/*
		Imports:
				External Libraries
*/
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


/*
		Imports:
				Material UI
				Icons
*/

import { Box, Chip, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@material-ui/core';
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
import { AddCourseSchema } from 'src/config/form-schemas';
import { RouteCourses } from 'src/config/routes';
import CourseService from 'src/services/CourseService';

/*
		Main Working
*/
export default ({ courses, editing }) => {

	const [serverError, setServerError] = useState('');
	const [openDia, setOpenDia] = React.useState(false);

	const navigate = useNavigate();

	const courseID = useParams().courseID;

	const formik = useFormik({
		initialValues: {
			name: '',
			code: '',
			prereq: [],
		},

		validationSchema: AddCourseSchema,

		onSubmit: () => {
			setSubmitting(true);
			addData();
		}
	});

	const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting, setFieldError } = formik;

	const addData = () => {

		let FunctionToCall = CourseService.addCourse;
		if (courseID)
			FunctionToCall = CourseService.updateCourse;

		let codeUpper = values.code.toUpperCase();

		console.log('Pre req', values.prereq);
		FunctionToCall(codeUpper, values.name, values.prereq, values.courseid)
			.then(() => {
				setOpenDia(true);
			})
			.catch((err) => {
				if (err.response) {
					if (err.response.data.error.details.errors.length == 2) {
						setFieldError('code', "This ID is already Taken");
						setFieldError('name', "This Name is already Taken");
					}
					else if (err.response.data.error.details.errors[0].path == "code") {
						setFieldError('code', "This ID is already Taken");
					}
					else if (err.response.data.error.details.errors[0].path == "name") {
						setFieldError('name', "This Name is already Taken");

					}
				}
				else
					setServerError('An Error Occured');
				setSubmitting(false);
			}).finally();
	};

	const handleEditing = () => {
		if (editing) {
			CourseService.find(courseID)
				.then((course) => {
					setFieldValue('courseid', course.id);
					setFieldValue('code', course.code);
					setFieldValue('name', course.name);
					setFieldValue('prereq', course.prereq_id);
				})
				.catch(() => {
					navigate('/404');
				});
		}
	};

	const handleClose = () => {
		setOpenDia(false);
		navigate(RouteCourses);
	};

	useEffect(handleEditing, [values.courseID]);

	return (
		<FormikProvider value={formik}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
				<Typography variant="h4" gutterBottom>
					{editing ? "Edit" : "Add"} Course
				</Typography>
			</Stack>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>

				<Typography variant="h6" gutterBottom>
					Course Details
				</Typography>

				<ContentStyle>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={6}>
							<ThemeProvider theme={FormTheme}>
								<InputLabel>Course ID</InputLabel>
							</ThemeProvider>
							<TextField
								inputProps={{ maxLength: 6, style: { textTransform: "uppercase" } }}
								fullWidth
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

				<Typography variant="h6" marginTop={4}>
					Select Prerequsite
				</Typography>
				{courses &&
					<ContentStyle>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={6}>
								<ThemeProvider theme={FormTheme}>
									<InputLabel label="Courses">Courses</InputLabel>
								</ThemeProvider>
								<Select fullWidth
									{...getFieldProps('prereq')}
									multiple
									error={Boolean(touched.prereq && errors.prereq)}
									renderValue={(selected) => (
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
											{selected.map((value) => (
												<Chip key={value} label={(courses.find(element => element.id == value).code)} />
											))}
										</Box>
									)}
								>
									{
										courses.map(row => (
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
					Course is {editing ? 'updated' : 'added'}
				</Dialog >
				<LoadingFormButton loading={isSubmitting}>
					{editing ? 'Save' : 'Add'}
				</LoadingFormButton>
				<ServerError open={serverError}>
					{serverError}
				</ServerError>
			</Form>
		</FormikProvider >
	);
};



