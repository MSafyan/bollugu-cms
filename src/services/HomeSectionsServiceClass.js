import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherServiceClass';

const title = 'templates';
const sections = 'sections';

class MenuService extends GenericService {
  constructor() {
    super();
    this.populate = [];
  }

  extractData(data) {
    const { id, attributes } = data;

    var templates = attributes.templates.data.map((_) => {
      return this.extractTemplate(_);
    });

    return {
      id,
      ...attributes,
      templates
    };
  }

  extractTemplate(data) {
    const { id, attributes } = data;
    const { images_list: files } = attributes;
    let fileArry;

    if (files) {
      const { data: file_data } = files;
      if (file_data)
        fileArry = file_data.map((image) => {
          return otherService.extractFile(image);
        });
    }
    return {
      id,
      ...attributes,
      images_list: fileArry
    };
  }
  getAll = () =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: ['templates', 'templates.images_list'],
        filters: {
          order: {
            $ne: 1
          }
        },
        sort: 'order:asc',
        pagniation: {
          pageSize: 1000
        }
      });
      this.get(`${sections}?${query}`)
        .then((response) => {
          console.log('Templates', this.getService(response));

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
          resolve(this.extractTemplate(response.data));
        })
        .catch((err) => reject(err));
    });

  getOneService = (id) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: '*'
      });
      this.get(`${sections}/${id}?${query}`)

        .then((response) => {
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
      this.post(`${sections}`, {
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
      this.put(`${sections}/${id}`, {
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
  removeService = (ID) => this.delete(`${sections}/${ID}`);
}

const menuService = new MenuService();

export default menuService;
