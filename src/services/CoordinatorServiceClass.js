import qs from 'qs';
import railfencecipher from 'railfencecipher';
import { RailFenceSize } from 'src/config/settings';
import madrisaService from './MadrisaService';
import UserService from './UserServiceClass';

class CoordinatorService extends UserService {

  constructor() {
    super();
    this.populate = ['user.image', 'user.contact.city', 'madarises'];
  }


  extractData(data) {
    const { id, attributes } = data;
    let qualification, experience, madrisa_a, user;

    if (attributes) {
      ({ qualification, experience, madarises: madrisa_a } = attributes);
      user = super.extractData(attributes);
    }

    let madrisa = 'None';
    let madrisa_id = [];
    let madaris = [];
    if (madrisa_a) {
      const { data: madrisa_data } = madrisa_a;
      let madrisa_array = [];
      for (const m of madrisa_data) {
        const element = madrisaService.extractData(m);
        madrisa_array.push(`${element.name} (${element.code})`);
        madrisa_id.push(element.id);
        madaris.push(element);
      }
      madrisa = madrisa_array.join(", ");
    }

    return {
      id,
      madrisa,
      qualification,
      experience,
      madrisa_id,
      madaris,
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
                'user.contact.city',
                'madarises'
              ]
            }
          );
          this.get(`coordinator/me?${query}`)
            .then((response) => {
              let user = { ...this.extractData(response.data), isCoordinator: true };
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
    let user = { ...u, isCoordinator: true };
    const encoded = railfencecipher.encodeRailFenceCipher(railfencecipher.encodeRailFenceCipher(JSON.stringify(user), RailFenceSize + 1), RailFenceSize);
    localStorage.setItem('user', encoded);
  };

  getAll = (page, pageSize) => new Promise(
    (resolve, reject) => {
      this.get(`coordinators?${qs.stringify(
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

  getCount = () =>
    new Promise((resolve, reject) => {
      this.get(
        `coordinators?`
      )
        .then((response) => {
          resolve(this.getTotalCount(response));
        })
        .catch((err) => reject(err));
    });

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify(
        {
          populate: this.populate
        });
      this.get(`coordinators/${ID}?${query}`)
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
      this.get(`coordinators?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data[0]));
        })
        .catch((err) => reject(err));
    }
    );

  coordinatorDoesNotExist = (ID) => new Promise((resolve, reject) => {
    const query = qs.stringify(
      {
        filters: {
          user: {
            username: {
              $eq: ID,
            }
          }
        }
      });
    this.get(`coordinators?${query}`, {})
      .then((response) => {
        if (response.data.length > 0)
          return reject(new Error("Already taken"));
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  addCoordinator = ((createUser, cnic, name, email, password, dob, gender, madarises, qualification, experience, contact, image, id) =>
    new Promise(async (resolve, reject) => {
      if (createUser) {
        this.addUser(cnic, name, email, password, dob, gender, contact, image)
          .then((user) => {
            this.post(`coordinators`, {
              data: {
                user: user.user.id,
                madarises,
                experience,
                qualification
              }
            })
              .then((res) => {
                resolve(this.extractData(res.data));
              });
          }).catch((err) => {
            reject(err);
          });
      }
      else {
        this.post(`coordinators`, {
          data: {
            user: id,
            madarises,
            experience,
            qualification
          }
        })
          .then((res) => {
            resolve(this.extractData(res.data));
          });
      }
    }
    ));

  update = ((_createUser, _cnic, name, email, _password, dob, gender, madarises, qualification, experience, contact, image, u_id, id) =>
    new Promise(async (resolve, reject) => {
      this.updateUser(u_id, name, email, null, dob, gender, contact, image)
        .then(() => {
          this.put(`coordinators/${id}`, {
            data: {
              madarises,
              experience,
              qualification
            }
          })
            .then((res) => {
              resolve(this.extractData(res.data));
            });
        })
        .catch((err) => {
          reject(err);
        });
    }));
}

export default CoordinatorService;
