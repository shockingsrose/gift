import httpClient from './httpClient';

export default {
  add(data) {
    return httpClient.post({ url: '/order/add', data });
  },
  list(data) {
    return httpClient.get({ url: '/order/getList', data });
  }
};
