import { post, query as queryService } from './../api.service';

const basePath = 'master/item-price';

export const getItemPrices = (path = '', query = '', headers = {}) => {
  return queryService(`${basePath}/${path}`, query, headers);
};

export const postItemPrices = (path = '', payload = {}, headers = {}) => {
  return post(`${basePath}/${path}`, payload, headers);
};
