import { get, post, query as queryService } from '../api.service';

const basePath = 'master/unit';

export const queryUnit = (path = '', query = '', headers = {}) => {
  return queryService(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    query,
    headers
  );
};

export const postUnit = (path = '', payload = {}, headers = {}) => {
  return post(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    payload,
    headers
  );
};

export const getUnit = (path = '', query = '', headers = {}) => {
  return get(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    query,
    headers
  );
};
