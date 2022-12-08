import qs from 'qs';
import BatchService from './BatchService';
import coordinatorService from './CoordinatorService';
import teacherService from './TeacherService';
import GenericService from './GenericService';

class MadrisaService extends GenericService {
  constructor() {
    super();
    this.populate = [
      'contact',
      'contact.city',
      'coordinators.user',
      'batches.sections.students',
      'teachers',
      'batches.classes.teacher',
      'batches.classes.course'
    ];
  }

  extractData(data) {
    const { id, attributes } = data;
    const {
      code,
      name,
      locked: blocked,
      contact,
      coordinators: coordinator_obj,
      batches: batches_obj,
      teachers: teachers_obj
    } = attributes;
    let teachers = [];
    if (teachers_obj) {
      const { data: teachers_data } = teachers_obj;
      teachers = teachers_data.map((teacher) => teacherService.extractData(teacher));
    }
    let address, city_object, city, province, city_id, phone;
    if (contact) {
      ({ address, city: city_object, phone } = contact);
      const { data: city_data } = city_object;
      const { attributes: city_attributes } = city_data;
      ({ name: city, province } = city_attributes);
      ({ id: city_id } = city_data);

    }

    let coordinators_array_id = [];
    let coordinators_array_name = [];
    let coordinatorIds = [];
    let cname;
    let cid;
    if (coordinator_obj) {
      const { data: co_data } = coordinator_obj;
      if (co_data.length > 0) {
        for (const element of co_data) {
          const coord = coordinatorService.extractData(element);
          coordinatorIds.push(coord.id);
          coordinators_array_id.push(coord.username);
          coordinators_array_name.push(coord.name);
        }
        cid = coordinators_array_id.join(', ');
        cname = coordinators_array_name.join(', ');
      }
    }

    let batches = [];
    if (batches_obj) {
      const { data: batch_data } = batches_obj;
      batches = batch_data.map((batch) => BatchService.extractData(batch));
    }

    return {
      id,
      name,
      code,
      blocked,
      city,
      province,
      address,
      city_id,
      cname,
      cid,
      teachers,
      batches,
      coordinatorIds,
      phone
    };
  }

  getAll = (page, pageSize, pop) =>
    new Promise((resolve, reject) => {
      this.get(
        `madaris?${qs.stringify({
          populate: pop ? pop : this.populate,
          pagination: {
            page,
            pageSize
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

  getCount = () =>
    new Promise((resolve, reject) => {
      this.get(`madaris?`)
        .then((response) => {
          resolve(this.getTotalCount(response));
        })
        .catch((err) => reject(err));
    });

  getOne = (ID, pop) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: pop ? pop : this.populate
      });
      this.get(`madaris/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  find = (ID, pop) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: pop ? pop : this.populate,
        filters: {
          code: {
            $eq: ID
          }
        }
      });
      this.get(`madaris?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data[0]));
        })
        .catch((err) => reject(err));
    });

  lock = (ID) =>
    this.put(`madaris/${ID}`, {
      data: { locked: true }
    });

  unlock = (ID) =>
    this.put(`madaris/${ID}`, {
      data: { locked: false }
    });

  addMadrassa = (code, name, contact, coordinators) =>
    Promise.resolve(this.post(`madaris`, {
      data: {
        code,
        name,
        contact,
        coordinators
      }
    }));

  update = (_code, name, contact, coordinators, id) =>
    Promise.resolve(this.put(`madaris/${id}`, {
      data: {
        name,
        contact,
        coordinators
      }
    }));

  getCurrentBatch = (mad) =>
    Promise.resolve(this.getOne(mad).then((madrisa) => {
      if (madrisa.batches.length > 0) {
        const batch = madrisa.batches[madrisa.batches.length - 1];
        return batch.year;
      }
    }));
}

export default MadrisaService;
