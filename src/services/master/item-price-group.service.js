import { post, get, query as queryService } from './../api.service';

const basePath = 'master/item-price-group';

export const postItemPriceGroup = (path = '', payload = {}, headers = {}) => {
  return post(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    payload,
    headers
  );
};

export const getItemPriceGroup = (path = '', query = '', headers = {}) => {
  return get(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    query,
    headers
  );
};

export const queryItemPriceGroup = (path = '', query = '', headers = {}) => {
  return queryService(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    query,
    headers
  );
};
