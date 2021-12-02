import { post } from './api.service';

// FIXME: Again, it's wasting time
export const postCustomItemPriceGroup = (path, payload, headers) => {
  return post(path, payload, headers);
};
