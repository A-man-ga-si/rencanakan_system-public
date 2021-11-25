// import { checkQueryPath } from '../utils';
import { post, get } from './api.service';

// NOTE: I have no idea why i make separate function instead of accessing api.service directly
export const getCustomItemPrice = (path = '', query = '', headers = {}) => {
  return get(path, query, headers);
};
