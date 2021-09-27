import { post, get } from './api.service';

const basePath = 'user';

export const postUser = (path = '', payload = {}, headers = {}) => {
  return post(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    payload,
    headers
  );
};

export const getUser = (path = '', query = '', headers = {}) => {
  return get(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    query
  );
};
