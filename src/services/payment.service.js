import { post } from './api.service';

const basePath = 'payment';

export const postPayment = (path = '', payload = {}, headers = {}) => {
  return post(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    payload,
    headers
  );
};
