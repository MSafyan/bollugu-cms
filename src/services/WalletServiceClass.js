import qs from 'qs';
import { ORDER_STATUS } from 'src/config/settings';
import GenericService from './GenericService';
import menuService from './MenuServiceClass';
import userService from './UserService';

class WalletService extends GenericService {

  extractData(data) {
    const { id, attributes } = data;

    const { amount, createdAt, status, order_items: oi_object, customer: c_object } = attributes;

    let customer;
    let customerID;
    if (c_object) {
      const { data: c_data } = c_object;
      if (c_data) {
        customer = c_data.attributes?.user?.data?.attributes?.email;
        customerID = c_data.id;
      }
    }

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
      order_items,
      customer,
      customerID
    };
  }

  checkOnBoarding = () => new Promise(
    (resolve, reject) => {
      this.get(`wallets/connectedAccount`)
        .then((response) => {
          if (response.data?.attributes?.accountLink) {
            resolve({ onboarding: true, url: response.data.attributes.accountLink });
          }
          else {
            this.get(`wallets/loginToStripe`).then((response) => {
              resolve({ onboarding: false, url: response.data.url });
            }).catch((err) => reject(err));
          }
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
          populate: ['order_items.menu_item', 'customer.user'],
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


  update = ((id, status, sendTo, chef, customer) =>
    new Promise((resolve, reject) => {
      this.put(`bookings/${id}`, {
        data: { status }
      }).then((response) => {
        console.log("Update", response);

        const email = {
          body: "Your order status has been changed to " + ORDER_STATUS[response.data.attributes.status],
          subject: `Order #${id} Status Changed`,
          sendTo,
          isEmail: true,
          chef,
          customer,
          sender: "chef"
        };

        this.post(`notifications`, email)
          .then((response) => {
            console.log("Notification", response);
            resolve(response);
          })
          .catch((err) => {
            console.log("Notification - err", err.response);
            reject(err);
          });
      })
    }));


  getBookings(response) {
    const { data } = response;
    console.log("Data", data.map((noti) => this.extractData(noti)));
    return { items: data.map((noti) => this.extractData(noti)), meta: response.meta };
  }

}

const walletService = new WalletService()

export default walletService;
