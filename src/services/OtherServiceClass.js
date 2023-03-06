import qs from 'qs';
import GenericService from './GenericService';

class OtherServiceClass extends GenericService {
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

  extractFileDirect(data) {
    const { id, name, ext, url, createdAt } = data;

    return {
      id,
      name,
      ext,
      url,
      uploadedOn: createdAt
    };
  }
}

const otherService = new OtherServiceClass();
export default otherService;
