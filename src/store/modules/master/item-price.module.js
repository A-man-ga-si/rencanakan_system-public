import {
  queryItemPrice,
  postItemPrices,
  getItemPrice,
} from '../../../services/master/item-price.service';

const state = {
  ungroupedItemPrices: [],
};

const getters = {
  getItemPrices: state => state.itemPrices,
  getUngroupedItemPrices: state => state.ungroupedItemPrices,
};

const mutations = {
  setItemPrices(state, data) {
    state.itemPrices = data;
  },
  setUngroupedItemPrices(state, data) {
    state.ungroupedItemPrices = data;
  },
};

const actions = {
  async fetchItemPrices({ commit }, province) {
    const data = await queryItemPrice('', `province=${province}&grouped=true`);
    return data;
  },
  async fetchUngroupedItemPrices({ commit }) {
    const data = await queryItemPrice();
    commit('setUngroupedItemPrices', data.data.data.itemPrices);
    return data;
  },
  async storeItemPrice(ctx, payload) {
    const data = await postItemPrices('', payload);
    return data;
  },
  async deleteItemPrice(ctx, id) {
    const data = await getItemPrice(`${id}/delete`);
    return data;
  },
  async updatePrice(ctx, { id, form }) {
    const data = await postItemPrices(`${id}/set-price`, form);
    return data;
  },
  async updateItemPrice(ctx, { id, form }) {
    const data = await postItemPrices(`${id}`, form);
    return data;
  },
  async batchUpdateItemPrice(ctx, { itemPriceId, form }) {
    const data = await postItemPrices(`${itemPriceId}/batch-update`, form);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
