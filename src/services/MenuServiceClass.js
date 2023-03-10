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

    const { image: file_obj, chef: chef_data } = attributes;

    let image;
    if (file_obj) {
      const { data: file_data } = file_obj;
      if (file_data) image = otherService.extractFile(file_data);
    }

    return {
      id,
      ...attributes,
      image,
      chef: chef_data?.data.id
    };
  }

  getAll = (chef) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          filters: {
            chef
          },
          populate: "*",
          pagniation: {
            pageSize: 1000
          }
        });
      this.get(`menu-items?${query}`)

        .then((response) => {
          console.log("Menu Items", this.getMenu(response));
          resolve(this.getMenu(response))
        })
        .catch((err) => reject(err));
    }
  );

  getOne = (id) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          populate: "*"
        });
      this.get(`menu-items/${id}?${query}`)

        .then((response) => {
          console.log("Menu Item", this.extractData(response.data));
          resolve(this.extractData(response.data))
        })
        .catch((err) => reject(err));
    }
  );


  add = ((data) =>
    Promise.resolve(this.post(`menu-items`, {
      data
    })));

  update = ((data, id) =>
    Promise.resolve(this.put(`menu-items/${id}`, {
      data
    })));


  getMenu(response) {
    const { data } = response;
    console.log("Data", data.map((noti) => this.extractData(noti)));
    return data.map((noti) => this.extractData(noti));
  }


  remove = (ID) => this.delete(`Menu/${ID}`);
}

const menuService = new MenuService()

export default menuService;
