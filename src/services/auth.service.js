import { checkQueryPath } from '../utils';
import { post, get } from './api.service';

const basePath = 'auth';

export const postAuth = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};

export const getAuth = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};
