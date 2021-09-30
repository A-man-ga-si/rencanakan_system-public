import {
  queryItemPrice,
  postItemPrices,
  getItemPrice,
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
    const data = await queryItemPrice('', `province=${province}&grouped=true`);
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
};

export default {
  state,
  getters,
  mutations,
  actions,
};
