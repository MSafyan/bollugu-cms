import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherServiceClass';

const title = 'works';

class MenuService extends GenericService {
  constructor() {
    super();
    this.populate = [];
  }

  extractData(data) {
    const { id, attributes } = data;

    const { image: file_obj } = attributes;
    const background = this.extractRelation(attributes.background);
    var layout = this.extractRelation(attributes.layout);
    debugger;
    if (layout) {
      layout.image = otherService.extractFile(layout.image.data);
    }

    let image;
    if (file_obj) {
      const { data: file_data } = file_obj;
      if (file_data) image = otherService.extractFile(file_data);
    }
    return {
      id,
      ...attributes,
      image,
      background,
      layout
    };
  }

  getAll = () =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: ['background', 'layout', 'image', 'layout.image'],
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
        populate: ['background', 'layout', 'image', 'layout.image']
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
