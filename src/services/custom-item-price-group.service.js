import { post, get } from './api.service';

// FIXME: Again, it's wasting time
export const postCustomItemPriceGroup = (path, payload = {}, headers = {}) => {
  return post(path, payload, headers);
};

export const getCustomItemPriceGroup = (path, query = '', headers = {}) => {
  return get(path, query, headers);
};
