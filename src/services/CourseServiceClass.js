import qs from 'qs';
import classService from './ClassService';
import GenericService from './GenericService';

class CourseService extends GenericService {
  constructor() {
    super();
    this.populate = ['pre'];
  }

  extractData(data) {
    const { id, attributes } = data;
    const { code, name, pre, classes: classes_obj } = attributes;

    let prereq_id = [];
    let pre_course_id = [];
    let pre_id = '-';
    if (pre) {
      const { data: pre_data } = pre;
      if (pre_data.length > 0) {
        for (const element of pre_data) {
          const prerequsite = this.extractData(element);
          pre_course_id.push(prerequsite.code);
          prereq_id.push(prerequsite.id);
        }
        pre_id = pre_course_id.join(', ');
      }
    }

    let classes = [];
    if (classes_obj) {
      const { data: classes_data } = classes_obj;
      classes = classes_data.map((class_) => classService.extractData(class_));
    }
    return {
      id,
      name,
      code,
      pre_id,
      pre_course_id,
      prereq_id,
      classes
    };
  }

  getCourses(response) {
    const { data } = response;
    return data.map((course) => this.extractData(course));
  }

  getAll = (page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `courses?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          }
        })}`
      )
        .then((response) => resolve(this.getCourses(response)))
        .catch((err) => reject(err));
    });

  getCount = () =>
    new Promise((resolve, reject) => {
      this.get(`courses`)
        .then((response) => {
          resolve(this.getTotalCount(response));
        })
        .catch((err) => reject(err));
    });


  getInMadrisa = (madrisa, pop) =>
    new Promise((resolve, reject) => {
      this.get(
        `courses?${qs.stringify({
          populate: pop ? pop : this.populate,
          filters: {
            classes: {
              batch: {
                madrisa: {
                  code: madrisa
                }
              }
            }
          }
        })}`
      )
        .then((response) => resolve(this.getCourses(response)))
        .catch((err) => reject(err));
    });

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate
      });
      this.get(`courses/${ID}?${query}`)
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
          code: ID
        }
      });
      this.get(`courses?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data[0]));
        })
        .catch((err) => reject(err));
    });

  addCourse = (code, name, pre) =>
    Promise.resolve(this.post(`courses`, {
      data: {
        code,
        name,
        pre,
      }
    }));

  updateCourse = (code, name, pre, id) =>
    Promise.resolve(this.put(`courses/${id}`, {
      data: {
        code,
        name,
        pre
      }
    }));
}

export default CourseService;
