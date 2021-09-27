import { get } from './../api.service';

const basePath = 'master/provinces';

export const getProvinces = (path = '', query = '', headers = {}) => {
  return get(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    query,
    headers
  );
};
