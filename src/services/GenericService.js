import axios from 'axios';
import { allowedExtensions, BackendURLAPI, maxUploadFileSize } from 'src/config/settings';
import renameFile from 'src/utils/renameFile';

axios.defaults.baseURL = BackendURLAPI;
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8' || 'application/json;';
class GenericService {
  tokenUpdate = () => {
    const token = localStorage.getItem('token');
    if (token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    else
      delete axios.defaults.headers.common.Authorization;
  };

  get = (url, data) =>
    new Promise((resolve, reject) => {
      axios
        .get(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });

  post = (url, data) =>
    new Promise((resolve, reject) => {
      axios
        .post(url, JSON.stringify(data))
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });

  postL = (url, data) =>
    new Promise((resolve, reject) => {
      axios
        .post(url, JSON.stringify(data), {
          transformRequest: [function (data_, headers) {
            delete headers.Authorization;
            delete headers.common.Authorization;
            return data_;
          }],
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });


  delete = (url) =>
    new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });

  put = (url, data) =>
    new Promise((resolve, reject) => {
      axios
        .put(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });

  upload(file, name, onUploadProgress) {
    let formData = new FormData();
    let extension = file.name.split(".");
    extension = extension[extension.length - 1];

    if (file.size > maxUploadFileSize) {
      return Promise.reject({ fileUploadError: true, msg: `Maximum ${maxUploadFileSize / 1024 / 1024} MB file allowed` });
    }

    if (!allowedExtensions.includes(extension)) {
      return Promise.reject({ fileUploadError: true, msg: 'Extension not allowed' });
    }

    formData.append("files", renameFile(file, `${name}.${extension}`));

    return axios.post("upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  deleteFile(file) {
    return axios.delete(`upload/files/${file}`);
  }



  getTotalCount(response) {
    const { meta } = response;
    let count = 0;
    if (meta) {
      const { pagination } = meta;
      if (pagination)
        count = pagination.total;
    }
    return count;
  }

  download(url, name) {
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
      transformRequest: [function (data_, headers) {
        delete headers.Authorization;
        delete headers.common.Authorization;
        return data_;
      }]
    })
      .then((response) => {
        const url_ = window.URL
          .createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url_;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  download2(url, name) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
export default GenericService;
