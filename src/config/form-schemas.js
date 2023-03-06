import * as Yup from 'yup';
const digitsOnly = (value) => /^\d+$/.test(value);

export const ResetSchema = (password) =>
  Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be atleast 6 characters')
      .max(30, 'Password must not be more than 30 characters'),
    confirm: Yup.string()
      .equals([password], 'Passwords do not match')
      .required('Confirm Password is required')
  });

export const ForgetSchema = Yup.object().shape({
  ID: Yup.string().required('Email is required').email('Valid Email is required')
});

export const LoginSchema = Yup.object().shape({
  ID: Yup.string().required('Email is required').email('Valid Email is required'),
  Password: Yup.string().required('Password is required')
});

export const AddMenuItemSchema = Yup.object().shape({
  title: Yup.string().required().label('Title')
});

export const AddServiceScheme = Yup.object().shape({
  url: Yup.string().required().label('Url'),
  order: Yup.string().required().label('Order')
});

export const BackgroundItemSchema = Yup.object().shape({
  color: Yup.string().required().label('Color')
});

export const FaviconItemSchema = Yup.object().shape({
  width: Yup.string().required().label('Width'),
  height: Yup.string().required().label('Height')
});

export const HomeTopItemSchema = Yup.object().shape({
  template_order: Yup.string()
    .required()
    .label('Order')
    .test((template_order, _) => {
      debugger;
      if (template_order !== '1') {
        return new Yup.ValidationError(`order should be 1`, undefined, 'template_order');
      }
      return true;
    }),
  text_three_type: Yup.string().required().label('Text Position')
});
export const HomeSectionItemSchema = Yup.object().shape({
  template_order: Yup.string().required().label('Order'),
  // text_three: Yup.string().required().label('Descirption'),
  // text_three_type: Yup.string().required().label('Text Position'),
  template_type: Yup.string().required().label('Template Type')
});

export const WorkItemSchema = Yup.object().shape({
  title: Yup.string().required().label('Title'),
  // background: Yup.string().required().label('Background'),
  order: Yup.string().required().label('order')
});

export const AboutSchema = Yup.object().shape({
  phoneNumber: Yup.string().test('Digits only', 'The field should have digits only', digitsOnly),
  tagline: Yup.string().required().label('Tagline'),
  address: Yup.string().required().label('Address'),
  email: Yup.string().required('Email is required').email('Valid Email is required')
});
export const HomeFooterSchema = Yup.object().shape({
  phoneNumber: Yup.string().test('Digits only', 'The field should have digits only', digitsOnly),
  email: Yup.string().required('Email is required').email('Valid Email is required')
});

export const SettingsSchema = Yup.object().shape({
  firstName: Yup.string().required('Name is required'),
  city: Yup.string().required('Location is required'),
  phoneNumber: Yup.string().required('Contact is required'),
  cuisineName: Yup.array().min(1, 'Please select at least one cuisine'),
  password: Yup.string()
    .min(6, 'Password must be atleast 6 characters')
    .max(30, 'Password must not be more than 30 characters'),
  confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});
