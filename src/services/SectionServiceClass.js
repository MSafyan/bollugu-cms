import qs from 'qs';
import batchService from './BatchService';
import StudentService from './StudentService';
import GenericService from './GenericService';

class SectionService extends GenericService {
  constructor() {
    super();
    this.populate = ['students', 'batch'];
  }

  extractData(data) {
    const { id, attributes } = data;
    const { section: name, students: students_obj, batch: batch_obj } = attributes;

    let students = [];
    if (students_obj) {
      const { data: student_data } = students_obj;
      students = student_data.map((student) => StudentService.extractData(student));
    }

    let batch;
    if (batch_obj) {
      const { data: batch_data } = batch_obj;
      batch = batchService.extractData(batch_data);
    }
    return {
      id,
      name,
      students,
      batch
    };
  }

  getAll = (BatchID, page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `sections?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            batch: {
              id: BatchID
            }
          }
        })}`
      )
        .then((response) => {
          const { data } = response;
          for (let index = 0; index < data.length; index += 1) {
            data[index] = this.extractData(data[index]);
          }
          resolve(data);
        })
        .catch((err) => reject(err));
    });

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate
      });
      this.get(`sections/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  addSection = (batch) => {
    return Promise.resolve(this.post(`sections`, {
      data: {
        batch
      }
    }));
  };

  moveStudents = (sectionID, students) =>
    this.put(`sections/${sectionID}`, {
      data: {
        students
      }
    });

  remove = (sectionID) =>
    this.delete(`sections/${sectionID}`);



}

export default SectionService;
