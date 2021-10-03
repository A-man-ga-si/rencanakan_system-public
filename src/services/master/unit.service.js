import { checkQueryPath } from '../../utils';
import { get, post, query as queryService } from '../api.service';

const basePath = 'master/unit';

export const queryUnit = (path = '', query = '', headers = {}) => {
  return queryService(checkQueryPath(basePath, path), query, headers);
};

export const postUnit = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};

export const getUnit = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};
