import { checkQueryPath } from '../utils';
import { post } from './api.service';

const basePath = 'payment';

export const postPayment = (path = '', payload = {}, headers = {}) => {
  return post(checkQueryPath(basePath, path), payload, headers);
};
