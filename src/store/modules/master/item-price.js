import {
  getItemPrices,
  postItemPrices,
} from '../../../services/master/item-price.service';

const state = {};

const getters = {
  getItemPrices: state => state.itemPrices,
};

const mutations = {
  setItemPrices(state, data) {
    state.itemPrices = data;
  },
};

const actions = {
  async fetchItemPrices({ commit }, province) {
    const data = await getItemPrices('', `province=${province}`);
    return data;
  },
  async storeItemPrice(ctx, payload) {
    const data = await postItemPrices('', payload);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
