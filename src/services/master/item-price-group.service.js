import { checkQueryPath } from '../../utils';
import { post, get, query as queryService } from './../api.service';

const basePath = 'master/item-price-group';

export const postItemPriceGroup = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};

export const getItemPriceGroup = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};

export const queryItemPriceGroup = (path = '', query = '', headers = {}) => {
  return queryService(checkQueryPath(basePath, path), query, headers);
};
