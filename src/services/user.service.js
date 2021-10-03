import { checkQueryPath } from '../utils';
import { post, get } from './api.service';

const basePath = 'user';

export const postUser = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};

export const getUser = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query);
};
