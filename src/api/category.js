import httpClient from './httpClient';

export default {
  getList(data) {
    return httpClient.get({ url: '/category/getList', data });
  }
};
