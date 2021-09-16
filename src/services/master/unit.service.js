import { get, post } from '../api.service';

const basePath = 'master/unit';

export const postUnit = (path = '', payload = {}, headers = {}) => {
  return post(`${basePath}/${path}`, payload, headers);
};

export const getUnit = (path = '', query = '', headers = {}) => {
  return get(`${basePath}/${path}`, query, headers);
};
