import qs from 'qs';
import GenericService from './GenericService';

class OtherServiceClass extends GenericService {
  getCities = (page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `cities?${qs.stringify({
          fields: 'name,province',
          pagination: {
            page,
            pageSize
          }
        })}`
      )
        .then((response) => {
          let cities = [];
          const { data } = response;
          for (let index = 0; index < data.length; index += 1) {
            const city = data[index];
            let object = {
              id: city.id,
              name: city.attributes.name,
              province: city.attributes.province
            };
            cities[index] = object;
          }
          resolve(cities);
        })
        .catch((err) => reject(err));
    });
  extractFile(data) {
    const { id, attributes } = data;
    const { name, ext, url, createdAt } = attributes;

    return {
      id,
      name,
      ext,
      url,
      uploadedOn: createdAt
    };
  }
}

export default OtherServiceClass;
