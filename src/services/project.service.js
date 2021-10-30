import { post, get } from './api.service';
import { checkQueryPath } from '../utils';

const basePath = 'project';

export const getProject = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};

export const postProject = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};
