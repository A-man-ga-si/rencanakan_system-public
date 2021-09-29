import { query as queryService } from './../api.service';

const basePath = 'master/ahs';

export const queryAhs = (path = '', query = '', headers = {}) => {
  return queryService(
    `${basePath}${path && !path.startsWith('?') ? `/${path}` : path}`,
    query,
    headers
  );
};
