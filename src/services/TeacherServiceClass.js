import qs from 'qs';
import UserService from './UserServiceClass';
import ClassService from './ClassService';
import { RailFenceSize } from 'src/config/settings';
import railfencecipher from 'railfencecipher';
import { responsiveFontSizes } from '@material-ui/core';

class TeacherService extends UserService {
  constructor() {
    super();
    this.populate = [
      'user.image',
      'user.contact.city',
      'madrisas',
      'classes.batch.madrisa',
      'classes.course',
      'classes.students',
      'classes.attendances'
    ];
  }

  extractData(data) {
    const { id, attributes } = data;
    const { subjects, qualification, experience, madrisas: madrisa_a, classes: classes_obj } = attributes;
    const user = super.extractData(attributes);

    let madrisa = 'None';
    let madrisa_code = '';
    let madrisa_ids = [];
    if (madrisa_a) {
      const { data: madrisa_data } = madrisa_a;
      let madrisa_array = [];
      if (madrisa_data.length > 0) {
        for (const element of madrisa_data) {
          madrisa_ids.push(element.id);
          madrisa_array.push(`${element.attributes.name} (${element.attributes.code})`);
          madrisa_code += element.attributes.code + ' ';
        }
        madrisa = madrisa_array.join(', ');
      }
    }

    let classes = [];
    if (classes_obj) {
      const { data: classes_data } = classes_obj;
      classes = classes_data.map((class_) => ClassService.extractData(class_));
    }

    return {
      id,
      madrisa,
      madrisa_code,
      qualification,
      experience,
      subjects,
      classes,
      madrisa_ids,
      ...user
    };
  }

  getTeachers(response) {
    const { data } = response;
    return data.map((teacher) => this.extractData(teacher));
  }

  login = (ID, Password) =>
    new Promise((resolve, reject) => {
      this.loginUser(ID, Password)
        .then((_res) => {
          const query = qs.stringify(
            {
              populate: [
                'user.image',
                'user.contact.city'
              ]
            }
          );
          this.get(`teacher/me?${query}`)
            .then((response) => {
              let user = { ...this.extractData(response.data), isTeacher: true };
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
    let user = { ...u, isTeacher: true };
    const encoded = railfencecipher.encodeRailFenceCipher(railfencecipher.encodeRailFenceCipher(JSON.stringify(user), RailFenceSize + 1), RailFenceSize);
    localStorage.setItem('user', encoded);
  };

  getAll = (page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `teachers?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          }
        })}`
      )
        .then((response) => resolve(this.getTeachers(response)))
        .catch((err) => reject(err));
    });

  getCount = () =>
    new Promise((resolve, reject) => {
      this.get(
        `teachers`
      )
        .then((response) => {
          resolve(this.getTotalCount(response));
        })
        .catch((err) => reject(err));
    });

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate
      });
      this.get(`teachers/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  find = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate,
        filters: {
          user: {
            username: ID
          }
        }
      });
      this.get(`teachers?${query}`)
        .then((response) => {
          if (response.data.length > 0)
            resolve(this.extractData(response.data[0]));
          else
            reject("Not found");
        })
        .catch((err) => reject(err));
    }
    );

  getByMadrisa = (Code, pop) => new Promise((resolve, reject) => {
    const query = qs.stringify({
      populate: pop ? pop : this.populate,
      filters: {
        madrisas: {
          code: {
            $contains: Code
          }
        }
      }
    });
    this.get(`teachers?${query}`)
      .then((response) => resolve(this.getTeachers(response)))
      .catch((err) => reject(err));
  }
  );

  search = (value, page, sort, pop) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: pop ? pop : this.populate,
        pagination: {
          page,
        },
        sort,
        filters: {
          $or:
            [
              {
                user: {
                  $or: [
                    {
                      username:
                      {
                        $containsi: value
                      }
                    },
                    {
                      name:
                      {
                        $containsi: value
                      }
                    },
                    {
                      email:
                      {
                        $containsi: value
                      }
                    }

                  ]

                },
              },
              {

                madrisas: {
                  $or: [
                    {
                      name: {
                        $containsi: value
                      }
                    },
                    {
                      code: {
                        $containsi: value
                      }
                    }
                  ]
                }
              }

            ]
        }
      });
      this.get(`teachers?${query}`)
        .then((response) => {
          response.data = this.getTeachers(response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });

  teacherDoesNotExist = (ID) => new Promise((resolve, reject) => {
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
    this.get(`teachers?${query}`, {})
      .then((response) => {
        if (response.data.length > 0)
          return reject(new Error("Already taken"));
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  addTeacher = ((createUser, cnic, name, email, password, dob, gender, qualification, experience, subjects, contact, madrisas, image, id) =>
    new Promise(async (resolve, reject) => {
      if (createUser) {
        this.addUser(cnic, name, email, password, dob, gender, contact, image)
          .then((user) => {
            resolve(this.post(`teachers`, {
              data: {
                user: user.user.id,
                experience,
                qualification,
                madrisas,
                subjects
              }
            }));
          }).catch((err) => {
            reject(err);
          });
      }
      else {
        resolve(this.post(`teachers`, {
          data: {
            user: id,
            experience,
            qualification,
            madrisas
          }
        }));
      }
    }
    ));

  update = ((_createUser, _cnic, name, email, _password, dob, gender, qualification, experience, subjects, contact, madrisas, image, u_id, id) =>
    new Promise(async (resolve, reject) => {
      this.updateUser(u_id, name, email, null, dob, gender, contact, image)
        .then((_user) => {
          resolve(this.put(`teachers/${id}`, {
            data: {
              madrisas,
              experience,
              qualification,
              subjects
            }
          }));
        })
        .catch((err) => {
          reject(err);
        });
    }));

  updateMadrisa = ((id, madrisas) => this.put(`teachers/${id}`, {
    data: {
      madrisas,
    }
  }));

}

export default TeacherService;
