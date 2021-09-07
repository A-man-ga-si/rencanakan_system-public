import { post, get } from './api.service';

const basePath = 'auth';

export const postAuth = (path = '', payload = {}) => {
  return post(`${basePath}/${path}`, payload);
};

export const getAuth = (path = '', query = '') => {
  return get(`${basePath}/${path}`, query);
};
