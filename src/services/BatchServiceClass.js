import qs from 'qs';
import SectionService from './SectionService';
import GenericService from './GenericService';
import madrisaService from './MadrisaService';
import classService from './ClassService';

class BatchService extends GenericService {
  constructor() {
    super();
    this.populate = ['sections.students', 'classes.teacher'];
  }

  extractData(data) {
    const { id, attributes } = data;
    const {
      year,
      sections: sections_obj,
      classes: classes_obj,
      madrisa: madrisa_object,
      blocked
    } = attributes;

    let sections = [];

    if (sections_obj) {
      const { data: sections_data } = sections_obj;
      sections = sections_data.map((section) => SectionService.extractData(section));
    }
    let madrisa;
    if (madrisa_object) {
      const { data: madrisa_data } = madrisa_object;
      madrisa = madrisaService.extractData(madrisa_data);
    }

    let classes = [];
    if (classes_obj) {
      const { data: classes_data } = classes_obj;
      classes = classes_data.map((class_) => classService.extractData(class_));
    }
    const batch = {
      id,
      year,
      sections,
      classes,
      blocked,
      madrisa
    };
    this.calculateBatchStudents(batch);
    return batch;
  }

  getAll = (MadrisaID, page, pageSize, pop) =>
    new Promise((resolve, reject) => {
      this.get(
        `batches?${qs.stringify({
          populate: pop ? pop : this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            madrisa: {
              $or: [
                {
                  id: MadrisaID
                },
                {
                  code: MadrisaID
                }
              ]

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

  getLatestBatch = (MadrisaID) =>
    new Promise((resolve, reject) => {
      this.get(
        `batches?${qs.stringify({
          populate: this.populate,
          pagination: {
            page: 0,
            pageSize: 1
          },
          sort: ['year:DESC'],
          filters: {
            madrisa: {
              $or: [
                {
                  id: MadrisaID
                },
                {
                  code: MadrisaID
                }
              ]

            }
          }
        })}`
      )
        .then((response) => {
          const { data } = response;
          if (data.length > 0) {
            resolve(this.extractData(data[0]));
            return;
          }
          reject("No batch found");
        })
        .catch((err) => reject(err));
    });

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate
      });
      this.get(`batches/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  async getStudentsInBatch(BatchID) {
    const query = qs.stringify({
      filters: {
        section: {
          batch: {
            id: BatchID
          }
        }
      }
    });
    const res = await this.get(`students?${query}`);
    return res.meta.pagination.total;
  }

  getSectionsInBatch = (BatchID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        filters: {
          batch: {
            id: BatchID
          }
        }
      });
      this.get(`sections?${query}`)
        .then((response) => {
          resolve(response.data.meta.pagination.total);
        })
        .catch((err) => reject(err));
    });

  lock = (ID) =>
    this.put(`batches/${ID}`, {
      data: { locked: true }
    });

  unlock = (ID) =>
    this.put(`batches/${ID}`, {
      data: { locked: false }
    });

  addBatch = (madrisa) =>
    Promise.resolve(this.post(`batches`, {
      data: {
        madrisa,
      }
    }));

  calculateBatchStudents(batch) {
    const sections = batch.sections;
    batch.students = 0;
    for (const section of sections) {
      batch.students += section.students.length;
    }
    batch.teachers = 0;
    const teacherArray = [];

    for (const t of batch.classes) {
      if (t.teacher)
        if (!teacherArray.includes(t.teacher.id)) {
          teacherArray.push(t.teacher.id);
          batch.teachers++;
        }
    }
  }
}

export default BatchService;
