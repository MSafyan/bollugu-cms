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

    const { image_url: file_obj } = attributes;
    const background = this.extractRelation(attributes.background);
    // var layout = this.extractRelation(attributes.layout);
    debugger;
    // if (layout) {
    //   layout.image = otherService.extractFile(layout.image.data);
    // }

    let image_url;
    if (file_obj) {
      const { data: file_data } = file_obj;
      if (file_data) image_url = otherService.extractFile(file_data);
    }
    return {
      id,
      ...attributes,
      image_url,
      background
    };
  }

  getAll = () =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: ['background', 'section_title', 'image_url'],
        pagniation: {
          pageSize: 1000
        }
      });
      this.get(`${title}?${query}`)

        .then((response) => {
          console.log('work', this.getService(response));
          resolve(this.getService(response));
        })
        .catch((err) => reject(err));
    });

  getOne = (id) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: ['background', 'section_title', 'image_url']
      });
      this.get(`${title}/${id}?${query}`)

        .then((response) => {
          console.log('work', this.extractData(response.data));
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

  remove = (ID) => this.delete(`${title}/${ID}`);
}

const menuService = new MenuService();

export default menuService;
