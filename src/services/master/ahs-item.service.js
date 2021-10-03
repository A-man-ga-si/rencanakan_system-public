import { checkQueryPath } from '../../utils';
import { get, post } from './../api.service';

const basePath = 'master/ahs-item';

export const getAhsItem = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};

export const postAhsItem = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};
