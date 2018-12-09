import httpClient from './httpClient';

export default {
  add(data) {
    return httpClient.post({ url: '/order/add', data });
  },
  list(data) {
    return httpClient.post({ url: '/order/getListByOwner', data, token: true });
  }
};
