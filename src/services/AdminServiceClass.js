import qs from 'qs';
import railfencecipher from 'railfencecipher';
import { RailFenceSize } from 'src/config/settings';
import UserService from './UserServiceClass';

class AdminService extends UserService {

  constructor() {
    super();
    this.populate = ['user.image', 'user.contact.city'];
  }

  extractData(data) {
    const { id, attributes } = data;
    const user = super.extractData(attributes);
    return {
      id,
      ...user
    };
  }

  login = (ID, Password) =>
    new Promise((resolve, reject) => {
      this.loginUser(ID, Password)
        .then(() => {
          const query = qs.stringify(
            {
              populate: [
                'user.image',
                'user.contact.city'
              ]
            }
          );
          this.get(`admins/me?${query}`)
            .then((response) => {
              let user = { ...this.extractData(response.data), isAdmin: true };
              const encoded = railfencecipher.encodeRailFenceCipher(railfencecipher.encodeRailFenceCipher(JSON.stringify(user), RailFenceSize + 1), RailFenceSize);
              localStorage.setItem('user', encoded);
              resolve(user);
            })
            .catch((err) => {
              localStorage.removeItem('token');
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });

  reAsignUser = (u) => {
    let user = { ...u, isAdmin: true };
    const encoded = railfencecipher.encodeRailFenceCipher(railfencecipher.encodeRailFenceCipher(JSON.stringify(user), RailFenceSize + 1), RailFenceSize);
    localStorage.setItem('user', encoded);
  };

  getAll = (page, pageSize) => new Promise(
    (resolve, reject) => {
      this.get(`admins?${qs.stringify(
        {
          populate: this.populate,
          pagination: {
            page,
            pageSize,
          }
        }
      )}`)
        .then((response) => {
          const { data } = response;
          for (let index = 0; index < data.length; index += 1) {
            data[index] = this.extractData(data[index]);
          }
          resolve(data);
        })
        .catch((err) => reject(err));
    }
  );

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify(
        {
          populate: this.populate
        });
      this.get(`admins/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    }
    );

  find = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify(
        {
          populate: this.populate,
          filters: {
            user: {
              username: ID
            }
          }
        });
      this.get(`admins?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data[0]));
        })
        .catch((err) => reject(err));
    }
    );

}

export default AdminService;
