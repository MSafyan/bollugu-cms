import qs from 'qs';
import GenericService from './GenericService';

class NotificationsService extends GenericService {

  constructor() {
    super();
    this.populate = [];
  }


  extractData(data, student) {
    const { id, attributes } = data;
    const { title, body: description, showOn, student: student_o } = attributes;
    let { read, url } = attributes;
    let readInArray = false;
    if (student) {
      if (!student_o.data) {
        readInArray = true;
        const { students: s_o } = attributes;
        if (s_o) {
          const { data: data_ } = s_o;
          if (data_.find((d) => d.id === student))
            read = true;
        }
      }
    }
    if (!url || url.length < 2)
      url = undefined;

    return {
      id,
      title,
      description,
      createdAt: showOn,
      url,
      read,
      readInArray,
      sid: student
    };
  }

  getAllCoordinators = (coordinator, page, pageSize) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          populate: this.populate,
          pagination: {
            page,
            pageSize,
          },
          filters: {
            $and: [
              {
                showOn: {
                  $lte: new Date()
                }
              },
              {
                coordinator: {
                  id: {
                    $eq: coordinator
                  }
                }
              }
            ]
          },
          sort: ['id:desc']
        });
      this.get(`notifications?${query}`)
        .then((response) => resolve(this.getNotifications(response)))
        .catch((err) => reject(err));
    }
  );


  addCoordinator = ((coordinator, title, body, url, showOn) =>
    Promise.resolve(this.post(`notifications`, {
      data: {
        coordinator,
        title,
        body,
        url,
        showOn: showOn ?? new Date()
      }
    })));

  getAllStudent = (student, page, pageSize) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          populate: ['student', 'students'],
          pagination: {
            page,
            pageSize,
          },
          filters: {
            $and: [
              {
                showOn: {
                  $lte: new Date()
                }
              },
              {
                $or: [
                  {
                    student: {
                      id: {
                        $eq: student
                      }
                    }
                  },
                  {
                    $and: [
                      {
                        student: {
                          id: { $null: true }
                        }
                      },
                      {
                        class_: {
                          students: {
                            id: student
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]

          },
          sort: ['id:desc']
        });
      this.get(`notifications?${query}`)
        .then((response) => {
          const { data } = response;
          for (let index = 0; index < data.length; index += 1) {
            data[index] = this.extractData(data[index], student);
          }
          resolve(data);
        })
        .catch((err) => reject(err));
    }
  );

  markRead = (id) =>
    this.put(`notifications/${id}`, {
      data: {
        read: true
      }
    });

  markReadA = (id, sid) =>
    this.put(`notification/${id}`, {
      data: {
        id: sid
      }
    });

  getNotifications(response) {
    const { data } = response;
    return data.map((noti) => this.extractData(noti));
  }

  addStudent = ((student, title, body, url, showOn) =>
    Promise.resolve(this.post(`notifications`, {
      data: {
        student,
        title,
        body,
        url,
        showOn: showOn ?? new Date()
      }
    })));

  addClass = ((class_, title, body, url, showOn) =>
    Promise.resolve(this.post(`notifications`, {
      data: {
        class_,
        title,
        body,
        url,
        showOn: showOn ?? new Date()
      }
    })));

  addClassAssignment = ((class_, assignment, title, body, url, showOn) =>
    Promise.resolve(this.post(`notifications`, {
      data: {
        class_,
        title,
        body,
        url,
        assignment,
        showOn: showOn ?? new Date()
      }
    })));

  addClassAnn = ((class_, announcement, title, body, url, showOn) =>
    Promise.resolve(this.post(`notifications`, {
      data: {
        class_,
        title,
        body,
        url,
        announcement,
        showOn: showOn ?? new Date()
      }
    })));


  getAllTeachers = (teacher, page, pageSize) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          populate: this.populate,
          pagination: {
            page,
            pageSize,
          },
          filters: {
            $and: [
              {
                showOn: {
                  $lte: new Date()
                }
              },
              {
                teacher: {
                  id: {
                    $eq: teacher
                  }
                }
              }
            ]
          },
          sort: ['showOn:desc']
        });
      this.get(`notifications?${query}`)
        .then((response) => resolve(this.getNotifications(response)))
        .catch((err) => reject(err));
    }
  );
  addTeacher = ((teacher, title, body, url, showOn) =>
    Promise.resolve(this.post(`notifications`, {
      data: {
        teacher,
        title,
        body,
        url,
        showOn: showOn ?? new Date()
      }
    })));

  addTeacherAssign = ((teacher, assignment, title, body, url, showOn) =>
    Promise.resolve(this.post(`notifications`, {
      data: {
        teacher,
        title,
        body,
        url,
        assignment,
        showOn: showOn ?? new Date()
      }
    })));

  getAssignment = (assignment) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          populate: this.populate,
          filters: {
            assignment: {
              id: {
                $eq: assignment
              }
            }
          },
          sort: ['id:desc']
        });
      this.get(`notifications?${query}`)
        .then((response) => resolve(this.getNotifications(response)))
        .catch((err) => reject(err));
    }
  );

  remove = (ID) => this.delete(`notifications/${ID}`);
}

export default NotificationsService;
