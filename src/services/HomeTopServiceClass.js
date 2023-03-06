import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherServiceClass';

const title = 'templates';

class MenuService extends GenericService {
  constructor() {
    super();
    this.populate = [];
  }

  extractData(data) {
    const { id, attributes } = data;
    const { images_list: file_obj } = attributes;
    let file;
    if (file_obj) {
      const { data: file_data } = file_obj;
      if (file_data) file = otherService.extractFile(file_data[0]);
    }
    return {
      id,
      ...attributes,
      images_list: file
    };
  }

  getAll = () =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: ['templates', 'templates.images_list'],
        filters: {
          order: {
            $eq: 1
          }
        },
        pagniation: {
          pageSize: 1000
        }
      });
      this.get(`services?${query}`)
        .then((response) => {
          var templates = response.data[0].attributes.templates;
          console.log('Templates', this.getService(templates));
          resolve(this.getService(templates));
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
