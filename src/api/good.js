import httpClient from './httpClient';

export default {
  getList(data) {
    return httpClient.post({ url: '/goods/getList', data });
  }
};
