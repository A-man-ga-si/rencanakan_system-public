import {
  postItemPriceGroup,
  getItemPriceGroup,
} from './../../../services/master/item-price-group.service';

const state = {};

const mutations = {};

const actions = {
  async storeItemPriceGroup(ctx, payload) {
    const data = await postItemPriceGroup('', payload);
    return data;
  },
  async destroyItemPriceGroup(ctx, id) {
    const data = await getItemPriceGroup(`${id}/delete`);
    return data;
  },
  async updateItemPriceGroup(ctx, { id, data: payload }) {
    const data = await postItemPriceGroup(id, payload);
    return data;
  },
};

export default {
  state,
  mutations,
  actions,
};
