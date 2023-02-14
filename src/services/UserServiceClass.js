import railfencecipher from 'railfencecipher';
import qs from 'qs';
import GenericService from './GenericService';
import { RailFenceSize } from 'src/config/settings';
import otherService from './OtherServiceClass';

class UserService extends GenericService {
  constructor() {
    super();
    this.populate = '*';
    this.query = qs.stringify({
      populate: this.populate
    });
  }

  loginUser = (ID, Password) =>
    new Promise((resolve, reject) => {
      this.postL('auth/local', {
        identifier: ID,
        password: Password
      })
        .then((data) => {
          localStorage.setItem('token', data.jwt);
          this.tokenUpdate();
          resolve(data.user);
        })
        .catch((err) => {
          reject(err);
        });
    });

  forgetPassword = (email) =>
    new Promise((resolve, reject) => {
      this.tokenUpdate();
      this.post('auth/forgot-password', {
        email
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });

  resetPassword = (password, code) =>
    new Promise((resolve, reject) => {
      this.tokenUpdate();
      this.post('auth/reset-password', {
        code,
        password,
        passwordConfirmation: password
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });

  extractDataDirect(u) {
    return {
      ...u
    };
  }

  logout = () => {
    localStorage.removeItem('token');
    this.tokenUpdate();
  };

  isLoggedInToken = () =>
    typeof localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === null;

  isLoggedIn = () =>
    new Promise((resolve, reject) => {
      if (this.isLoggedInToken()) {
        this.tokenUpdate(null);
        reject(new Error('Not Logged In'));
        return false;
      }
      resolve();
      return true;
    });

  getLoggedInUser = () =>
    new Promise((resolve, reject) => {
      const user = localStorage.getItem('user');
      if (user) {
        const decode = railfencecipher.decodeRailFenceCipher(
          railfencecipher.decodeRailFenceCipher(user, RailFenceSize),
          RailFenceSize + 1
        );
        resolve(JSON.parse(decode));
      } else {
        localStorage.removeItem('token');
        this.tokenUpdate();
        reject(new Error('Not Logged In'));
      }
    });

  updateUser = (body, id) => {
    if (!(body.password && body.password.length > 3)) {
      delete body.password;
      delete body.confirm;
    }
    return this.put(`chefs/${id}`, { data: body });
  };

  updateUserimage = (id, image) => {
    let body = { image };
    return this.put(`users/${id}`, body);
  };

  extractData(attributes) {
    const { user: user_object } = attributes;
    let phone, address, city, province, city_id;
    let image = undefined;
    let imageID;
    let u_id, username, name, email, blocked, dob, gender;

    if (user_object) {
      const { data: u_data } = user_object;
      if (u_data) {
        const { id: u_idd, attributes: u_attributes } = u_data;
        const { contact, image: img } = u_attributes;
        ({ username, name, email, blocked, dob, gender } = u_attributes);
        u_id = u_idd;
        if (contact) {
          let city_object;
          ({ phone, address, city: city_object } = contact);
          if (city_object) {
            const { data: city_data } = city_object;
            const { attributes: city_attributes } = city_data;
            ({ name: city, province } = city_attributes);
            ({ id: city_id } = city_data);
          }
        }
        if (img) {
          const { data: img_data } = img;
          if (img_data) {
            image = img_data.attributes.url;
            imageID = img_data.id;
          }
        }
      }
    }

    return {
      u_id,
      username,
      name,
      email,
      blocked,
      phone,
      image,
      imageID,
      gender,
      address,
      city,
      city_id,
      province,
      dob
    };
  }

  login = (ID, Password) =>
    new Promise((resolve, reject) => {
      this.loginUser(ID, Password)
        .then(() => resolve(this.getMe()))
        .catch((err) => {
          reject(err);
        });
    });

  getMe = () =>
    new Promise((resolve, reject) => {
      this.get(`users/me`)
        .then((response) => {
          console.log('Response', response);
          if (true) {
            let user = this.extractDataDirect(response);
            const encoded = railfencecipher.encodeRailFenceCipher(
              railfencecipher.encodeRailFenceCipher(JSON.stringify(user), RailFenceSize + 1),
              RailFenceSize
            );
            localStorage.setItem('user', encoded);
            resolve(user);
          } else {
            localStorage.removeItem('token');
            reject({ message: 'User is not a Chef' });
          }
        })
        .catch((err) => {
          localStorage.removeItem('token');
          reject(err);
        });
    });

  checkOnBoarding = () =>
    new Promise((resolve, reject) => {
      this.get(`wallets/connectedAccount`)
        .then((response) => {
          if (response.data?.attributes?.accountLink) {
            resolve({ onboarding: false, url: response.data.attributes.accountLink });
          } else {
            this.get(`wallets/loginToStripe`)
              .then((response) => {
                resolve({ onboarding: true, url: response.url });
              })
              .catch((err) => reject(err));
          }
        })
        .catch((err) => reject(err));
    });

  completeOnBoarding = () =>
    new Promise((resolve, reject) => {
      this.get(`wallets/boardingSuccess`)
        .then(() => {
          resolve();
        })
        .catch((err) => reject(err));
    });
}

export default UserService;
