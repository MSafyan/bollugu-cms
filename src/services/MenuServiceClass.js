import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherService';

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

  getAll = (chef) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          chef,
          populate: "*"
        });
      this.get(`menu-items?${query}`)

        .then((response) => {
          console.log("Menu Items", this.getMenu(response));
          resolve(this.getMenu(response))
        })
        .catch((err) => reject(err));
    }
  );


  addCoordinator = ((coordinator, title, body, url, showOn) =>
    Promise.resolve(this.post(`Menu`, {
      data: {
        coordinator,
        title,
        body,
        url,
        showOn: showOn ?? new Date()
      }
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
