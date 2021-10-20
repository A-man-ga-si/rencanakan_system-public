import { post, get } from './../api.service';
import { checkQueryPath } from './../../utils';

const basePath = 'master/ahp';

export const getAhp = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};

export const postAhp = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};
