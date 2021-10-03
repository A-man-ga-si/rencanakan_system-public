import { checkQueryPath } from '../utils';
import { post, get } from './api.service';

const basePath = 'company';

export const postCompany = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};

export const getCompany = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};
