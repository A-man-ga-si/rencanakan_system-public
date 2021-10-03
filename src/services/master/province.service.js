import { checkQueryPath } from '../../utils';
import { get } from './../api.service';

const basePath = 'master/provinces';

export const getProvinces = (path = '', query = '', headers = {}) => {
  return get(checkQueryPath(basePath, path), query, headers);
};
