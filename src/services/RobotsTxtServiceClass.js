import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherServiceClass';

const modelName = 'robotstxts';

class MenuService extends GenericService {
  constructor() {
    super();
    this.populate = [];
  }

  extractData(data) {
    const { id, attributes } = data;

    const { file: file_obj } = attributes;

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

  getAll = () =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: '*',
        pagniation: {
          pageSize: 1000
        }
      });
      this.get(`${modelName}?${query}`)

        .then((response) => {
          console.log(modelName, this.getService(response));
          resolve(this.getService(response));
        })
        .catch((err) => reject(err));
    });

  getOne = (id) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: '*'
      });
      this.get(`${modelName}/${id}?${query}`)

        .then((response) => {
          console.log(modelName, this.extractData(response.data));
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  add = (data) =>
    Promise.resolve(
      this.post(modelName, {
        data
      })
    );

  update = (data, id) =>
    Promise.resolve(
      this.put(`${modelName}/${id}`, {
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

  remove = (ID) => this.delete(`${modelName}/${ID}`);
}

const menuService = new MenuService();

export default menuService;
