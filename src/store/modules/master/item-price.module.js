import ApiTwo from '../../../services/ApiTwo.service';

const masterItemPrice = new ApiTwo({
  previousPath: 'master',
  basePath: 'item-price',
});

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
    // prettier-ignore
    const data = await masterItemPrice.query('', `province=${province}&grouped=true`);
    return data;
  },

  async fetchUngroupedItemPrices({ commit }) {
    const data = await masterItemPrice.query();
    commit('setUngroupedItemPrices', data.data.data.itemPrices);
    return data;
  },

  async storeItemPrice(ctx, payload) {
    const data = await masterItemPrice.post('', payload);
    return data;
  },

  async deleteItemPrice(ctx, id) {
    const data = await masterItemPrice.post(`${id}/delete`);
    return data;
  },

  async updatePrice(ctx, { id, form }) {
    const data = await masterItemPrice.post(`${id}/set-price`, form);
    return data;
  },

  async updateItemPrice(ctx, { id, form }) {
    const data = await masterItemPrice.post(`${id}`, form);
    return data;
  },

  async batchUpdateItemPrice(ctx, { itemPriceId, form }) {
    // prettier-ignore
    const data = await masterItemPrice.post(`${itemPriceId}/batch-update`, form);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
