import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherService';

class CourseService extends GenericService {
  constructor() {
    super();
    this.populate = ['file'];
  }

  extractData(data) {
    const { id, attributes } = data;
    const { topic, details, type, url, createdAt, file: file_obj } = attributes;

    let file;
    if (file_obj) {
      const { data: file_data } = file_obj;
      if (file_data) file = otherService.extractFile(file_data);
    }


    return {
      id,
      topic,
      details,
      type,
      url,
      createdAt,
      file
    };
  }

  getAllCC(response) {
    const { data } = response;
    return data.map((cc) => this.extractData(cc));
  }

  getAll = (ID, page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `course-contents?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            course: {
              id: ID
            }
          }
        })}`
      )
        .then((response) => resolve(this.getAllCC(response)))
        .catch((err) => reject(err));
    });

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate
      });
      this.get(`course-contents/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });


  add = ((class_, course, topic, type, details, url, file) =>
    new Promise(async (resolve) => {
      if (!file)
        file = null;
      resolve(this.post(`course-contents`, {
        data: {
          class_,
          course,
          topic,
          type,
          details,
          url,
          file,
        }
      }));
    }
    ));

  update = ((class_, course, topic, type, details, url, file, id) =>
    new Promise(async (resolve) => {
      if (!file)
        file = null;
      resolve(this.put(`course-contents/${id}`, {
        data: {
          class_,
          course,
          topic,
          type,
          details,
          url,
          file,
        }
      }));
    }
    ));

  findAll = (ID, page, pageSize) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify(
        {
          populate: this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            course: {
              code: ID
            }
          }
        });
      this.get(`course-contents?${query}`)
        .then((response) => resolve(this.getAllCC(response)))
        .catch((err) => reject(err));
    }
    );

  remove = (ID) => this.delete(`course-contents/${ID}`);
}

export default CourseService;
