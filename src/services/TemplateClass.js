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

  getOne = (id) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: '*'
      });
      this.get(`${title}/${id}?${query}`)

        .then((response) => {
          console.log('Menu Item', this.extractTemplate(response.data));
          resolve(this.extractTemplate(response.data));
        })
        .catch((err) => reject(err));
    });

  add = (data) =>
    Promise.resolve(
      this.post(`${title}`, {
        data
      })
    );

  update = (data, id) => {
    debugger;
    return Promise.resolve(
      this.put(`${title}/${id}`, {
        data
      })
    );
  };

  getService(response) {
    const { data } = response;
    console.log(
      'Data',
      data.map((noti) => this.extractTemplate(noti))
    );
    return data.map((noti) => this.extractTemplate(noti));
  }

  remove = (ID) => this.delete(`${title}/${ID}`);
}

const menuService = new MenuService();

export default menuService;
