export const TITLE = 'Archi Portal';
export const fullTitle = 'Archi Portal - Admin Portal';
export const defaultPassword = '12341234';
export const rowsPerPageList = [25, 50, 100, 200];
export const defaultPerPage = 25;
export const BackendURL = 'https://chezchef.herokuapp.com/';
export const BackendURLAPI = 'https://bolligu-be.herokuapp.com/api/';
// export const BackendURLAPI = 'http://localhost:1337/api/';

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
  'txt',
  'xml',
  'mp4'
];

export const DefaultColor = '#000000';

export const acceptImageUpload = 'image/png, image/jpg, image/jpeg';
export const acceptFileUpload =
  'image/png, image/jpg, image/jpeg, audio/mp3, application/pdf, application/zip, application/doc, application/docx, application/ppt, application/pptx, application/txt , application/xml , text/xml, video/mp4 , text/* ';
export const maxUploadFileSize = 100 * 1024 * 1024; //100 Mbs
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

export const textPositions = [
  'none',
  'left_black',
  'left_white',
  'right_black ',
  'right_white',
  'center_black',
  'center_white',
  'white_bg_text',
  'white_bg_title',
  'white_bg_title_text'
];

export const imagePositions = ['none', 'horizontal', 'vertical', 'full'];

export const templateTypes = [
  'full_screen',
  'auto_black_background',
  'black_background',
  'white_background',
  'auto_white_background',
  'auto_black_background_big'
];

export const YesNo = ['No', 'Yes'];

export const templateTypeHasImage = ['full_screen', 'white_background'];
export const templateTypeHasTextPosition = ['full_screen'];

export const TemplateHas = {
  full_screen: {
    images_list: true,
    text_three_type: true,
    text_three: true,
    note: 'Note: You can have image or mp4, caption is optional and will be displayed on the border of the screen',
    actions: {
      template_type: 'full_screen',
      text_one_type: 'none',
      text_two_type: 'none',
      text_three_type: 'none'
    }
  },
  full_screen_white_text: {
    text_two: true,
    text_two_type: true,
    note: 'Note: You can Text on full Screen, and its background will be black',
    actions: {
      template_type: 'white_background',
      text_two_type: 'white_bg_title_text',
      text_one_type: 'none'
    }
  },
  // auto_black_background: {
  //   text_one: true,
  //   text_one_type: true,
  //   note: 'Note: You can Text on full Screen, and its background will be black',
  //   actions: { template_type: 'auto_black_background', text_one_type: 'center_black' }
  // },
  auto_black_background_big: {
    text_one: true,
    text_one_type: true,
    text_three: true,
    text_three_type: true,
    note: 'Note: Bigger Text on full Screen, caption is optional and will be displayed on the border of the screen and its background will be black',
    actions: { template_type: 'auto_black_background_big', text_two_type: 'none' }
  },
  LTextRFileWhite: {
    text_one: true,
    text_one_type: true,
    text_three: true,
    text_three_type: true,
    images_list: true,
    image_two_type: true,
    note: 'Note: Text on the Left side and file on the right side, caption is optional and will be displayed on the border of the screen and its background will be white',
    actions: {
      template_type: 'white_background',
      text_one_type: 'white_bg_title',
      text_one_type: 'none',
      text_three_type: 'none',
      image_two_type: 'horizontal'
    }
  },
  LFileRTextWhite: {
    text_two: true,
    text_two_type: true,
    text_three: true,
    text_three_type: true,
    images_list: true,
    image_one_type: true,
    note: 'Note: Text on the Right side and file on the left side, caption is optional and will be displayed on the border of the screen and its background will be white',
    actions: {
      template_type: 'white_background',
      image_one_type: 'horizontal',
      text_one_type: 'none',
      text_two_type: 'white_bg_title_text',
      text_three_type: 'none'
    }
  },
  // LTextRTextWhite: {
  //   text_one: true,
  //   text_one_type: true,
  //   text_two: true,
  //   text_two_type: true,
  //   text_three: true,
  //   text_three_type: true,
  //   note: 'Note: Text on the Left side and Text on the right side, caption is optional and will be displayed on the border of the screen and its background will be white',
  //   actions: {
  //     template_type: 'white_background',
  //     text_one_type: 'white_bg_title',
  //     text_two_type: 'white_bg_title',
  //     text_three_type: 'none'
  //   }
  // },
  LFileRFileWhite: {
    // text_three: true,
    // text_three_type: true,
    images_list: true,
    image_one_type: true,
    image_two_type: true,
    note: 'Note: File on the Left side and File on the right side, caption is optional and will be displayed on the border of the screen and its background will be white',
    actions: {
      template_type: 'white_background',
      text_one_type: 'none',
      text_two_type: 'none',
      text_three_type: 'none',
      image_one_type: 'horizontal',
      image_two_type: 'horizontal'
    }
  },
  LTextRFileBlack: {
    text_one: true,
    text_one_type: true,
    text_three: true,
    text_three_type: true,
    images_list: true,
    image_two_type: true,
    note: 'Note: Text on the Left side and file on the right side, caption is optional and will be displayed on the border of the screen and its background will be black',
    actions: {
      template_type: 'black_background',
      text_one_type: 'white_bg_title',
      text_two_type: 'none',
      text_three_type: 'none',
      image_two_type: 'horizontal'
    }
  }
  // LFileRTextBlack: {
  //   text_two: true,
  //   text_two_type: true,
  //   text_three: true,
  //   text_three_type: true,
  //   images_list: true,
  //   image_one_type: true,
  //   note: 'Note: Bigger Text on full Screen, caption is optional and will be displayed on the border of the screen and its background will be white',
  //   actions: {
  //     template_type: 'black_background',
  //     text_one_type: 'white_bg_title',
  //     text_three_type: 'center_white'
  //   }
  // },
  // LTextRTextBlack: {
  //   text_one: true,
  //   text_one_type: true,
  //   text_two: true,
  //   text_two_type: true,
  //   text_three: true,
  //   text_three_type: true,
  //   note: 'Note: Bigger Text on full Screen, caption is optional and will be displayed on the border of the screen and its background will be black',
  //   actions: {
  //     template_type: 'black_background',
  //     text_one_type: 'white_bg_title',
  //     text_three_type: 'center_white'
  //   }
  // },
  // LFileRFileBlack: {
  //   text_three: true,
  //   text_three_type: true,
  //   images_list: true,
  //   image_one_type: true,
  //   image_two_type: true,
  //   note: 'Note: Bigger Text on full Screen, caption is optional and will be displayed on the border of the screen and its background will be black',
  //   actions: {
  //     template_type: 'black_background',
  //     image_one_type: 'horizontal',
  //     image_two_type: 'horizontal'
  //   }
  // }
};
