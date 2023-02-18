export const TITLE = 'Archi Portal';
export const fullTitle = 'Archi Portal - Admin Portal';
export const defaultPassword = '12341234';
export const rowsPerPageList = [25, 50, 100, 200];
export const defaultPerPage = 25;
export const BackendURL = 'https://chezchef.herokuapp.com/';
// export const BackendURLAPI = 'https://api.chezchefs.com/api/';
export const BackendURLAPI = 'http://localhost:1337/api/';

export const LoginImage = '/static/logo.gif';
export const ForgetPageImage = '/static/illustrations/forgot.gif';
export const ResetPageImage = ForgetPageImage;
export const Image404 = '/static/illustrations/404.gif';
export const Image401 = Image404;
export const DefaultAvatar = '/static/illustrations/avatar.webp';
export const DefaultUploadedFileImage = '/static/icons/file.png';

export const DefaultFood = '/static/illustrations/missingfood.jpg';

export const RailFenceSize = 3;

export const allowedExtensions = [
  'png',
  'jpg',
  'jpeg',
  'mp3',
  'pdf',
  'zip',
  'rar',
  'docx',
  'doc',
  'ppt',
  'pptx',
  'txt'
];

export const DefaultColor = '#000000';

export const acceptImageUpload = 'image/png, image/jpg, image/jpeg';
export const acceptFileUpload =
  'image/png, image/jpg, image/jpeg, audio/mp3, application/pdf, application/zip, application/doc, application/docx, application/ppt, application/pptx, application/txt';
export const maxUploadFileSize = 10 * 1024 * 1024; //10 Mbs
export const hideFileAlertIn = 3000;

export const ORDER_STATUS = {
  Order_placed: 'Order Placed',
  Being_Prepared: 'Being Prepared',
  In_Transit: 'In Transit',
  Delivered: 'Delivered',
  Cancel: 'Cancelled'
};

export const ORDER_STATUS_ORDER = [
  'Order_placed',
  'Being_Prepared',
  'In_Transit',
  'Delivered',
  'Cancel'
];
