import { checkQueryPath } from '../utils';
import { get } from './api.service';

export const getRab = (path = '', query = '', headers = {}) => {
  return get(path, query, headers);
};
