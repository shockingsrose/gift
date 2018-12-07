import httpClient from './httpClient';

export default {
  getCode: (data) => httpClient.post({ url: '/user/getCode', data }),
  checkCode: (data) => httpClient.post({ url: '/user/checkCode', data }),
  register: (data) => httpClient.post({ url: '/user/reg', data }),
  login: (data) => httpClient.post({ url: '/user/login', data })
};
