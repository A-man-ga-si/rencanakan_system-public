import { post, get } from './api.service';

const basePath = 'user';

export const postUser = (path = '', payload = {}, headers = {}) => {
  return post(`${basePath}/${path}`, payload, headers);
};

export const getUser = (path = '', query = '', headers = {}) => {
  return get(`${basePath}/${path}`, query);
};
