import GenericService from './GenericService';

class AnnouncementServiceClass extends GenericService {
  extractData(data) {
    const { id, attributes } = data;
    const { details, createdAt: date } = attributes;

    return {
      id,
      details,
      date
    };
  }

  add = (details, class_) =>
    Promise.resolve(this.post(`class-announcements`, {
      data: {
        details,
        class_
      }
    }));

  remove = (ID) =>
    this.delete(`class-announcements/${ID}`);

}

export default AnnouncementServiceClass;
