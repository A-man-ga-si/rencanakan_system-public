import { post, get } from './api.service';

const basePath = 'auth';

export const postAuth = (path = '', payload = {}, headers = {}) => {
  return post(`${basePath}/${path}`, payload, headers);
};

export const getAuth = (path = '', query = '', headers = {}) => {
  return get(`${basePath}/${path}`, query, headers);
};
