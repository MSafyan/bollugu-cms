import railfencecipher from 'railfencecipher';
import qs from 'qs';
import GenericService from './GenericService';
import { RailFenceSize } from 'src/config/settings';
import otherService from './OtherService';

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
    const { image: file_obj, insurance: i_obj, certificate: c_obj, } = u.info;
    let image;
    if (file_obj) {
      image = otherService.extractFileDirect(file_obj);
    }

    let insurance;
    if (i_obj) {
      insurance = otherService.extractFileDirect(i_obj);
    }

    let certificate;
    if (c_obj) {
      certificate = otherService.extractFileDirect(c_obj);
    }

    console.log("Got", file_obj, i_obj, c_obj);

    return {
      ...u,
      ...u.info,
      image, insurance, certificate
    };
  }
  register = (name, email, password) => this.post('users/register', { password, email, name });

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
        const decode = railfencecipher.decodeRailFenceCipher(railfencecipher.decodeRailFenceCipher(user, RailFenceSize), RailFenceSize + 1);
        resolve(JSON.parse(decode));
      }
      else {
        localStorage.removeItem('token');
        this.tokenUpdate();
        reject(new Error('Not Logged In'));
      }
    });

  getUser = (ID) =>
    new Promise((resolve, reject) => {

      this.get(`users/${ID}?${this.query}`, {})
        .then((user) => {
          resolve(this.extractDataDirect(user));
        })
        .catch((err) => {
          reject(err);
        });
    });

  findUser = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify(
        {
          populate: this.populate,
          filters: {
            username: {
              $eq: ID,
            }
          }
        });
      this.get(`users?${query}`, {})
        .then((user) => {
          if (user.length > 0) {
            return resolve(this.extractDataDirect(user[0]));
          }

          reject(new Error('User not found'));
        })
        .catch((err) => {
          reject(err);
        });
    });

  addUser = (username, name, email, password, dob, gender, contact, image) =>
    this.post(`auth/local/register`, {
      username,
      name,
      email,
      password,
      dob,
      gender,
      contact,
      image
    });

  updateUser = (body, id) => {
    if (!(body.password && body.password.length > 3)) {
      delete body.password;
      delete body.confirm;
    }
    return this.put(`chefs/${id}`, { data: body });
  };

  updateUserimage = (id, image) => {
    let body = { image, };
    return this.put(`users/${id}`, body);
  };

  userDoesNotExist = (ID) => new Promise((resolve, reject) => {
    const query = qs.stringify(
      {
        filters: {
          username: {
            $eq: ID,
          }
        }
      });
    this.get(`users?${query}`, {})
      .then((response) => {
        if (response.length > 0)
          return reject(new Error("Already taken"));
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

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
      dob,
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

  reAsignUser = (u) => {
    let user = { ...u, isAdmin: true };
    const encoded = railfencecipher.encodeRailFenceCipher(railfencecipher.encodeRailFenceCipher(JSON.stringify(user), RailFenceSize + 1), RailFenceSize);
    localStorage.setItem('user', encoded);
  };

  getMe = () => new Promise((resolve, reject) => {
    this.get(`users/me`)
      .then((response) => {
        console.log("Response", response);
        if (response.role.name.toLowerCase() == "chef") {
          let user = { ...this.extractDataDirect(response), isAdmin: true };
          const encoded = railfencecipher.encodeRailFenceCipher(railfencecipher.encodeRailFenceCipher(JSON.stringify(user), RailFenceSize + 1), RailFenceSize);
          localStorage.setItem('user', encoded);
          resolve(user);
        }
        else {
          localStorage.removeItem('token');
          reject({ message: "User is not a Chef" });
        }

      })
      .catch((err) => {
        localStorage.removeItem('token');
        reject(err);
      });
  });

  settingsUpdate = ((name, email, password, dob, gender, contact, image, u_id) =>
    this.updateUser(u_id, name, email, password, dob, gender, contact, image));

  lock = (ID) => this.put(`users/${ID}`, {
    blocked: true
  });

  unlock = (ID) => this.put(`users/${ID}`, {
    blocked: false
  });
}

export default UserService;
