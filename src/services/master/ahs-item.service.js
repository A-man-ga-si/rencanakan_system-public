import { get } from './../api.service';

const basePath = 'master/ahs-item';

export const getAhsItem = (path = '', query = '', headers = {}) => {
  return get(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    query,
    headers
  );
};
