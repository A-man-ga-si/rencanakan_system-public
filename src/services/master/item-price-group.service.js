import { post, get } from './../api.service';

const basePath = 'master/item-price-group';

export const postItemPriceGroup = (path = '', payload = {}, headers = {}) => {
  return post(`${basePath}/${path}`, payload, headers);
};

export const getItemPriceGroup = (path = '', query = '', headers = {}) => {
  return get(`${basePath}/${path}`, query, headers);
};
