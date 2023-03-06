import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherServiceClass';
import templateService from './TemplateClass';

const title = 'services';

class MenuService extends GenericService {
  constructor() {
    super();
    this.populate = [];
  }

  extractData(data) {
    const { id, attributes } = data;

    const { svg: file_obj } = attributes;

    let formatted;
    if (file_obj) {
      const { data: file_data } = file_obj;
      if (file_data) formatted = otherService.extractFile(file_data);
    }
    debugger;
    var tempData = attributes.template?.data;
    if (tempData) var template = templateService.extractTemplate(tempData);

    return {
      id,
      ...attributes,
      template: template ?? {},
      svg: formatted
    };
  }

  getAll = () =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: ['template', 'svg', 'template.images_list'],
        sort: 'order:asc',
        pagniation: {
          pageSize: 1000
        }
      });
      this.get(`${title}?${query}`)
        .then((response) => {
          console.log('services', this.getService(response));

          resolve(this.getService(response));
        })
        .catch((err) => reject(err));
    });

  getOne = (id) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: ['template', 'svg', 'template.images_list']
      });
      this.get(`${title}/${id}?${query}`)

        .then((response) => {
          console.log('Menu Item', this.extractData(response.data));
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  getOneService = (id) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: '*'
      });
      this.get(`${services}/${id}?${query}`)

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

  addservice = (data) =>
    Promise.resolve(
      this.post(`${services}`, {
        data
      })
    );

  update = (data, id) =>
    Promise.resolve(
      this.put(`${title}/${id}`, {
        data
      })
    );

  updateService = (data, id) =>
    Promise.resolve(
      this.put(`${services}/${id}`, {
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

  remove = (ID) => this.delete(`${title}/${ID}`);
}

const menuService = new MenuService();

export default menuService;
