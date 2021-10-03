import { checkQueryPath } from '../../utils';
import { post, get, query as queryService } from './../api.service';

const basePath = 'master/ahs';

export const queryAhs = (path = '', query = '', headers = {}) => {
  return queryService(checkQueryPath(basePath, path), query, headers);
};

export const getAhs = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};

export const postAhs = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};
