import { get, post, query as queryService } from './../api.service';

const basePath = 'master/item-price';

export const queryItemPrice = (path = '', query = '', headers = {}) => {
  return queryService(`${basePath}/${path}`, query, headers);
};

export const postItemPrices = (path = '', payload = {}, headers = {}) => {
  return post(`${basePath}/${path}`, payload, headers);
};

export const getItemPrice = (path = '', query = '', headers = {}) => {
  return get(`${basePath}/${path}`, query, headers);
};
