import * as Yup from 'yup';
import { cnicRegExp, courseCodeRegExp, feeAmountRegExp, madrisaCodeRegExp, nameRegExp, phoneRegExp, studentCodeRegExp } from './regex';

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

export const LoginSchemaStudent = Yup.object().shape({
	ID:
		Yup.string()
			.required('Student ID is required')
			.matches(studentCodeRegExp, 'Valid Student ID is required'),
	Password:
		Yup.string()
			.required('Password is required')
});


export const AddCoordinatorSchema = Yup.object().shape({
	ID:
		Yup.string()
			.required('CNIC is required')
			.matches(cnicRegExp, 'Valid CNIC is required'),
	name:
		Yup.string()
			.required('Name is required')
			.matches(nameRegExp, 'Enter a valid name'),
	contact:
		Yup.string()
			.required('Contact is required')
			.matches(phoneRegExp, 'Enter valid Contact Number'),
	email:
		Yup.string()
			.required('Email is required')
			.email('Enter correct email'),
	gender:
		Yup.string()
			.required('Gender is required'),
	dob:
		Yup.date()
			.required("Please enter date of birth")
			.test("dob", "Please choose a valid date of birth", (value) => {
				const d = new Date(value);
				return new Date().getFullYear() - d.getFullYear() >= 5;
			}),
});

export const AddMadrisaSchema = Yup.object().shape({
	name:
		Yup.string()
			.required('Name is required')
			.matches(nameRegExp, 'Enter a valid name'),
	contact:
		Yup.string()
			.required('Contact is required')
			.matches(phoneRegExp, 'Enter valid Contact Number'),
	code:
		Yup.string()
			.required('Code is required')
			.matches(madrisaCodeRegExp, "Enter Valid Code")
});

export const AddCourseSchema = Yup.object().shape({
	name:
		Yup.string()
			.required('Name is required'),
	code:
		Yup.string()
			.required('Course ID is required')
			.matches(courseCodeRegExp, 'Enter Valid Course Code')
});

export const AddFeeSchema = Yup.object().shape({
	amount:
		Yup.string()
			.required('Amount is required')
			.matches(feeAmountRegExp, 'Enter valid amount'),

});

export const SettingsSchema = (password) => Yup.object().shape({
	contact:
		Yup.string()
			.required('Contact is required')
			.matches(phoneRegExp, 'Enter valid Contact Number'),
	email:
		Yup.string()
			.required('Email is required')
			.email('Enter correct email'),

	password:
		Yup.string()
			.min(6, 'Password must be atleast 6 characters')
			.max(30, 'Password must not be more than 30 characters'),
	confirm:
		Yup.string()
			.equals([password], 'Passwords do not match')
});

export const AddCourseContentSchema = Yup.object().shape({
	type:
		Yup.string()
			.required('Type is required'),
	topic:
		Yup.string()
			.required('Title is required'),
	file:
		Yup.string()
			.when('type', {
				is: 'File',
				then: Yup.string().required('File is required')
			}),
	url:
		Yup.string()
			.when('type', {
				is: 'Url',
				then: Yup.string().required('Link is required')
			})
			.when('type', {
				is: 'Video',
				then: Yup.string().required('Link is required')
			})

});

export const AddTeacherSchema = Yup.object().shape({
	ID:
		Yup.string()
			.required('CNIC is required')
			.matches(cnicRegExp, 'Valid CNIC is required'),
	name:
		Yup.string()
			.required('Name is required')
			.matches(nameRegExp, 'Enter a valid name'),
	contact:
		Yup.string()
			.required('Contact is required')
			.matches(phoneRegExp, 'Enter valid Contact Number'),
	email:
		Yup.string()
			.required('Email is required')
			.email('Enter correct email'),
	gender:
		Yup.string()
			.required('Gender is required'),
	dob:
		Yup.date()
			.required("Please enter date of birth")
			.test("dob", "Please choose a valid date of birth", (value) => {
				const d = new Date(value);
				return new Date().getFullYear() - d.getFullYear() >= 5;
			}),
	experience: Yup.number().required('Please enter experince in term of years')
});

export const AddClassSchema = Yup.object().shape({
	teacher:
		Yup.string()
			.min(0, "Please Select Section"),
	section: Yup.object({
		id: Yup.string().min(0, "Section is required"),
	}),
	course:
		Yup.string()
			.min(0, "Please Select Section"),

});

export const AddClassSchemaEditing = Yup.object().shape({
	teacher:
		Yup.string().required("Teacher is required"),
	course:
		Yup.string()
			.min(0, "Please Select Section"),
});

export const AddStudentSchema = Yup.object().shape({
	name:
		Yup.string()
			.required('Name is required')
			.matches(nameRegExp, 'Enter a valid name'),
	contact:
		Yup.string()
			.required('Contact is required')
			.matches(phoneRegExp, 'Enter valid Contact Number'),
	email:
		Yup.string()
			.required('Email is required')
			.email('Enter correct email'),
	gender:
		Yup.string()
			.required('Gender is required'),
	dob:
		Yup.date()
			.required("Please enter date of birth")
			.test("dob", "Please choose a valid date of birth", (value) => {
				const d = new Date(value);
				return new Date().getFullYear() - d.getFullYear() >= 5;
			}),
});

export const AddSectionSchema = Yup.object().shape({
	numberSections:
		Yup.number()
			.required('Number of Sections is required')
			.min(1, 'Please enter value greater than 0'),
});

export const AddAnnouncementSchema = Yup.object().shape({
	details:
		Yup.string()
			.required('Please enter announcement')
});

export const AddAttendanceSchema = Yup.object().shape({
	topic:
		Yup.string()
			.required('Topic is Required')
});

export const AddAssignmentSchema = Yup.object().shape({
	topic:
		Yup.string()
			.required('Topic is Required'),
	marks:
		Yup.number()
			.required('Enter Total Marks')
			.min(0, 'Please Enter Valid Marks'),
});

export const AddMarksSchema = Yup.object().shape({
	topic:
		Yup.string()
			.when('type', {
				is: ('Assignment' || 'Test'),
				then: Yup.string().required('Topic is required')
			}),
	marks:
		Yup.number()
			.required('Enter Total Marks')
			.min(0, 'Please Enter Valid Marks'),
});