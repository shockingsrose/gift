import axios from 'axios';
import Cookies from 'js-cookie';

const api = 'http://47.97.205.230:18087';

const tokenValue = Cookies.get('token');

const client = (method) => ({ url, data, token = false }) =>
  new Promise((resolve, reject) => {
    const config = { url: `${api}${url}`, method };
    if (method === 'post') {
      Object.assign(config, { data });
    } else {
      Object.assign(config, { params: data });
    }
    if(token) {
      Object.assign(config, { headers: { token: tokenValue } });
    }
    axios
      .request(config)
      .then((res) => {
        if (res.data.code === 'Success') resolve(res.data.result);
        else reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
export default {
  post: client('post'),
  get: client('get')
};
