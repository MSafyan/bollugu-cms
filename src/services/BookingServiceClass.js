import qs from 'qs';
import GenericService from './GenericService';
import menuService from './MenuServiceClass';
import otherService from './OtherService';

class BookingService extends GenericService {

  constructor() {
    super();
    this.populate = [];
  }


  extractData(data) {
    const { id, attributes } = data;

    const { amount, createdAt, status, order_items: oi_object } = attributes;

    let order_items;
    if (oi_object) {
      const { data: oi_data } = oi_object;
      if (oi_data) {
        order_items = oi_data.map((oi) => {


          const { quantity, menu_item: mi_object } = oi.attributes;

          let menu_item;
          if (mi_object) {
            const { data: mi_data } = mi_object;
            if (mi_data) {
              menu_item = menuService.extractData(mi_data);
            }
          }

          return {
            quantity,
            ...menu_item
          }
        });
      }
    }

    return {
      id,
      amount,
      createdAt,
      status,
      order_items
    };
  }

  getActive = (chef, pagination) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          populate: "order_items.menu_item",
          filters: {
            $and: [
              { chef },
              {
                status: {
                  $ne: "Delivered"
                }

              },
              {
                status: {
                  $ne: "Cancel"
                }

              },
              {
                $or: [
                  {
                    status: {
                      $containsi: pagination.search
                    }
                  },
                  {
                    id: {
                      $containsi: pagination.search
                    }
                  },
                  {
                    createdAt: {
                      $containsi: pagination.search
                    }
                  },
                ]
              }
            ]
          },
          sort: `${pagination.sort_by}:${pagination.order}`,
          populate: ['order_items.menu_item'],
          pagination: {
            page: pagination.page + 1,
            pageSize: pagination.perPage
          }
        }, { encodeValuesOnly: true });
      this.get(`bookings?${query}`)

        .then((response) => {
          console.log("Bookings", this.getBookings(response));
          resolve(this.getBookings(response))
        })
        .catch((err) => reject(err));
    }
  );

  getPast = (chef, pagination) => new Promise(
    (resolve, reject) => {
      const query = qs.stringify(
        {
          populate: "order_items.menu_item",
          filters: {
            $and: [
              { chef },
              {
                $or: [
                  {
                    status: {
                      $eq: "Delivered"
                    }

                  },
                  {
                    status: {
                      $eqi: "Cancel"
                    }
                  },
                ]
              }
              ,
              {
                $or: [
                  {
                    status: {
                      $containsi: pagination.search
                    }
                  },
                  {
                    id: {
                      $containsi: pagination.search
                    }
                  },
                  {
                    createdAt: {
                      $containsi: pagination.search
                    }
                  },
                ]
              }
            ]
          },
          sort: `${pagination.sort_by}:${pagination.order}`,
          populate: ['order_items.menu_item'],
          pagination: {
            page: pagination.page + 1,
            pageSize: pagination.perPage
          }
        }, { encodeValuesOnly: true });
      this.get(`bookings?${query}`)

        .then((response) => {
          console.log("Bookings", this.getBookings(response));
          resolve(this.getBookings(response))
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

  update = ((id, status) =>
    Promise.resolve(this.put(`bookings/${id}`, {
      data: { status }
    })));


  getBookings(response) {
    const { data } = response;
    console.log("Data", data.map((noti) => this.extractData(noti)));
    return { items: data.map((noti) => this.extractData(noti)), meta: response.meta };
  }


  remove = (ID) => this.delete(`Menu/${ID}`);
}

const bookingService = new BookingService()

export default bookingService;
