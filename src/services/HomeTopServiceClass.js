import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherServiceClass';

const title = 'backgrounds';

class MenuService extends GenericService {
  constructor() {
    super();
    this.populate = [];
  }

  extractData(data) {
    const { id, attributes } = data;

    return {
      id,
      ...attributes
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
      this.get(`${title}?${query}`)

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
      this.get(`${title}/${id}?${query}`)

        .then((response) => {
          console.log('Menu Item', this.extractData(response.data));
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  add = (data) =>
    Promise.resolve(
      this.post(`${title}`, {
        data
      })
    );

  update = (data, id) =>
    Promise.resolve(
      this.put(`${title}/${id}`, {
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
