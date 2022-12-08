import qs from 'qs';
import batchService from './BatchService';
import madrisaService from './MadrisaService';
import GenericService from './GenericService';

class FeeService extends GenericService {
  constructor() {
    super();
    this.populate = ['batch.sections.students', 'madrisa'];
  }

  extractData(data) {
    const { id, attributes } = data;
    const { amount, paid, batch: batch_obj, madrisa: madrisa_obj } = attributes;

    let batch;
    let students = 0;
    if (batch_obj) {
      const { data: batch_data } = batch_obj;
      if (batch_data) {
        batch = batchService.extractData(batch_data);
        batch.sections.forEach((s) => {
          students += s.students.length;
        });
      }
    }

    let madrisa;
    if (madrisa_obj) {
      const { data: madrisa_data } = madrisa_obj;
      if (madrisa_data) {
        madrisa = madrisaService.extractData(madrisa_data);
      }
    }

    return {
      id,
      amount,
      paid,
      batch,
      madrisa,
      students
    };
  }

  getAllFee(response) {
    const { data } = response;
    return data.map((fee) => this.extractData(fee));
  }

  getAll = (page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `fees?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          }
        })}`
      )
        .then((response) => resolve(this.getAllFee(response)))
        .catch((err) => reject(err));
    });

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate
      });
      this.get(`fees/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  findByCoordinator = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate,
        filters: {
          madrisa: {
            coordinators: { id: ID }
          }
        }
      });
      this.get(`fees?${query}`)
        .then((response) => resolve(this.getAllFee(response)))
        .catch((err) => reject(err));
    });

  addFee = (madrisa, batch, amount) =>
    Promise.resolve(this.post(`fees`, {
      data: {
        madrisa,
        batch,
        amount
      }
    }));

  pay = (ID) =>
    this.put(`fees/${ID}`, {
      data: { paid: true }
    });

  unpay = (ID) =>
    this.put(`fees/${ID}`, {
      data: { paid: false }
    });
}

export default FeeService;
