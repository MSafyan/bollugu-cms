import qs from 'qs';
import UserService from './UserServiceClass';
import ClassService from './ClassService';
import sectionService from './SectionService';
import { RailFenceSize } from 'src/config/settings';
import railfencecipher from 'railfencecipher';

class StudentService extends UserService {
  constructor() {
    super();
    this.populate = [
      'user.image',
      'user.contact.city',
      'classes.course',
      'classes.teacher.user',
      'classes.marks.marks.student',
      'classes.attendances.students',
      'section.batch.madrisa',
      'classes.students'
    ];
  }

  extractData(data) {
    const { id, attributes } = data;
    const { classes: classes_obj, section: section_obj } = attributes;
    const user = super.extractData(attributes);
    let student = {
      id,
      marks: [],
      attendance: [],
      attendanceFactor: 0,
      ...user
    };
    let classes = [];
    if (classes_obj) {
      const { data: classes_data } = classes_obj;
      for (const element of classes_data) {
        const cleanedClass = ClassService.extractData(element, student);
        cleanedClass.students = cleanedClass.students.length > 0 ? cleanedClass.students[0] : cleanedClass.students;
        classes.push(cleanedClass);

      }
    }
    let section;
    if (section_obj) {
      const { data: section_data } = section_obj;
      section = sectionService.extractData(section_data);
    }

    student = {
      ...student,
      classes,
      section
    };
    return student;
  }

  getStudents(response) {
    const { data } = response;
    return data.map((student) => this.extractData(student));
  }

  login = (ID, Password) =>
    new Promise((resolve, reject) => {
      this.loginUser(ID, Password)
        .then(() => {
          const query = qs.stringify({
            populate: [
              'user.image',
              'user.contact.city'
            ]
          });
          this.get(`student/me?${query}`)
            .then((response) => {
              let user = { ...this.extractData(response.data), isStudent: true };
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
    let user = { ...u, isStudent: true };
    const encoded = railfencecipher.encodeRailFenceCipher(railfencecipher.encodeRailFenceCipher(JSON.stringify(user), RailFenceSize + 1), RailFenceSize);
    localStorage.setItem('user', encoded);
  };

  getAll = (page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `students?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          }
        })}`
      )
        .then((response) => resolve(this.getStudents(response)))
        .catch((err) => reject(err));
    });

  getBySection = (ID, pop) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: pop ? pop : this.populate,
        filters: {
          section: {
            id: {
              $eq: ID
            }
          }
        }
      });
      this.get(`students?${query}`)
        .then((response) => resolve(this.getStudents(response)))
        .catch((err) => reject(err));
    });

  getCount = () =>
    new Promise((resolve, reject) => {
      this.get(
        `students?`
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
      this.get(`students/${ID}?${query}`)
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
      this.get(`students?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data[0]));
        })
        .catch((err) => reject(err));
    });

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
                section: {
                  batch: {
                    madrisa: {
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
                }
              }
            ]
        }
      });
      this.get(`students?${query}`)
        .then((response) => {
          response.data = this.getStudents(response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });


  searchInMadrisa = (madrisa, value, page, sort, pop) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: pop ? pop : this.populate,
        pagination: {
          page,
        },
        sort,
        filters: {
          $and: [
            {
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
                ]
            },
            {
              section: {
                batch: {
                  madrisa: {
                    code: madrisa
                  }
                }
              }
            }
          ]
        }
      });
      this.get(`students?${query}`)
        .then((response) => {
          response.data = this.getStudents(response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  searchMail = (value, page, sort) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate,
        pagination: {
          page,
        },
        sort,
        filters: {
          user: {
            email:
            {
              $eq: value
            }
          },
        }
      });
      this.get(`students?${query}`)
        .then((response) => resolve(this.getStudents(response)))
        .catch((err) => reject(err));
    });
  searchBatch = (batchID, value, page, sort, pop) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: pop ? pop : this.populate,
        pagination: {
          page,
        },
        sort,
        filters: {
          $and:
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
                section: {
                  batch: {
                    id: batchID
                  }
                }
              }

            ]
        }
      });
      this.get(`students?${query}`)
        .then((response) => {
          response.data = this.getStudents(response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });

  addStudent = ((section, name, email, contact, dob, gender, image, password) => {
    const query = qs.stringify({
      populate: this.populate
    });
    return this.post(`students?${query}`, {
      data: {
        section,
        name,
        email,
        contact,
        dob,
        gender,
        password,
        image
      }
    });
  });

  update = ((section, name, email, contact, dob, gender, image, _password, u_id, id) =>
    new Promise(async (resolve, reject) => {
      this.updateUser(u_id, name, email, null, dob, gender, contact, image)
        .then(() => {
          resolve(this.put(`students/${id}`, {
            data: {
              section,
            }
          }));
        })
        .catch((err) => {
          reject(err);
        });
    }));

  remove = (ID) =>
    this.delete(`students/${ID}?populate=user`);

}



export default StudentService;
