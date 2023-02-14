import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherServiceClass';

class MenuService extends GenericService {
  constructor() {
    super();
    this.populate = [];
  }

  extractData(data) {
    const { id, attributes } = data;

    const { svg: file_obj } = attributes;

    let svg;
    if (file_obj) {
      const { data: file_data } = file_obj;
      if (file_data) svg = otherService.extractFile(file_data);
    }

    return {
      id,
      ...attributes,
      svg
    };
  }

  getAll = (chef) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        filters: {
          chef
        },
        populate: '*',
        pagniation: {
          pageSize: 1000
        }
      });
      this.get(`services?${query}`)

        .then((response) => {
          console.log('Service', this.getService(response));
          resolve(this.getService(response));
        })
        .catch((err) => reject(err));
    });

  getOne = (id) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: '*'
      });
      this.get(`services/${id}?${query}`)

        .then((response) => {
          console.log('Menu Item', this.extractData(response.data));
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  add = (data) =>
    Promise.resolve(
      this.post(`services`, {
        data
      })
    );

  update = (data, id) =>
    Promise.resolve(
      this.put(`services/${id}`, {
        data
      })
    );

  getService(response) {
    const { data } = response;
    console.log(
      'Data',
      data.map((noti) => this.extractData(noti))
    );
    return data.map((noti) => this.extractData(noti));
  }

  remove = (ID) => this.delete(`Menu/${ID}`);
}

const menuService = new MenuService();

export default menuService;
