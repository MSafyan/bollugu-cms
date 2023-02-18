import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherServiceClass';

const title = 'layouts';

class MenuService extends GenericService {
  constructor() {
    super();
    this.populate = [];
  }

  extractData(data) {
    const { id, attributes } = data;

    const { image: file_obj } = attributes;

    let image;
    if (file_obj) {
      const { data: file_data } = file_obj;
      if (file_data) image = otherService.extractFile(file_data);
    }

    return {
      id,
      ...attributes,
      image
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
  getService(response) {
    const { data } = response;
    console.log(
      'layout',
      data.map((noti) => this.extractData(noti))
    );
    return data.map((noti) => this.extractData(noti));
  }
}

const menuService = new MenuService();

export default menuService;
