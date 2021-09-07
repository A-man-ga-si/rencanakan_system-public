import { post, get, del } from './api.service';

const basePath = 'company';

export const postCompany = (path = '', payload = {}, headers = {}) => {
  return post(`${basePath}/${path}`, payload, headers);
};

export const getCompany = (path = '', query = '', headers = {}) => {
  return get(`${basePath}/${path}`, query, headers);
};

export const deleteCompany = (path = '', query = '', headers = {}) => {
  return del(`${basePath}/${path}`, query, headers);
};
