import * as Yup from 'yup';

export const ResetSchema = (password) => (
	Yup.object().shape({
		password:
			Yup.string()
				.required('Password is required')
				.min(6, 'Password must be atleast 6 characters')
				.max(30, 'Password must not be more than 30 characters'),
		confirm:
			Yup.string()
				.equals([password], 'Passwords do not match')
				.required('Confirm Password is required')
	})
);

export const ForgetSchema = Yup.object().shape({
	ID:
		Yup.string()
			.required('Email is required')
			.email('Valid Email is required')
});

export const LoginSchema = Yup.object().shape({
	ID:
		Yup.string()
			.required('Email is required')
			.email('Valid Email is required'),
	Password:
		Yup.string()
			.required('Password is required')
});

export const AddMenuItemSchema = Yup.object().shape({
	name:
		Yup.string()
			.required('Name is required'),
	description:
		Yup.string()
			.required('Description is required'),
	price:
		Yup.number()
			.required('Price is required')
			.min(0, 'Price can not be less than 0'),
	availbility:
		Yup.array()
			.min(1, 'Please select at least one day'),
});


export const SettingsSchema = Yup.object().shape({
	firstName:
		Yup.string()
			.required('Name is required'),
	city:
		Yup.string()
			.required('Location is required'),
	phoneNumber:
		Yup.string()
			.required('Contact is required'),
	cuisineName:
		Yup.string()
			.required('Cuisine is required'),
	password:
		Yup.string()
			.min(6, 'Password must be atleast 6 characters')
			.max(30, 'Password must not be more than 30 characters'),
	confirm:
		Yup.string()
			.oneOf([Yup.ref('password'), null], 'Passwords must match')
});
