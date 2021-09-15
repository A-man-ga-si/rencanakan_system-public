import { post } from '../api.service';

const basePath = 'master/unit';

export const postUnit = (path = '', payload = {}, headers = {}) => {
  return post(`${basePath}/${path}`, payload, headers);
};
