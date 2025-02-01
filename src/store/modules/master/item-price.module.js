import ApiTwo from '../../../services/ApiTwo.service';

const masterItemPrice = new ApiTwo({
  previousPath: 'master',
  basePath: 'item-price',
});

const state = {
  ungroupedItemPrices: [],
};

const getters = {
  getItemPrices: (state) => state.itemPrices,
  getUngroupedItemPrices: (state) => state.ungroupedItemPrices,
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
  async fetchItemPrices(_, request) {
    let params = new URLSearchParams({
        limit: request.limit,
        page: request.page || 1,
        province_id: request.provinceId ,
        group_id: request.groupId,
      });
      const response = await masterItemPrice.get('', decodeURIComponent(params));
      return response;
  },

  async fetchUngroupedItemPrices({ commit }) {
    const data = await masterItemPrice.query();
    commit('setUngroupedItemPrices', data.data.data.itemPrices);
    return data;
  },

  async storeItemPrice(_, payload) {
    const data = await masterItemPrice.post('', payload);
    return data;
  },

  async deleteItemPrice(_, id) {
    const data = await masterItemPrice.post(`${id}/delete`);
    return data;
  },

  async updatePrice(ctx, { id, form }) {
    const data = await masterItemPrice.post(`${id}/set-price`, form);
    return data;
  },

  async updateItemPrice(_, { id, request }) {
    const data = await masterItemPrice.post(`${id}`, request);
    return data;
  },

  async batchUpdateItemPrice(ctx, { itemPriceId, form }) {
    // prettier-ignore
    const data = await masterItemPrice.post(`${itemPriceId}/batch-update`, form);
  },

  async exportItemPrice(ctx) {
    return await masterItemPrice.download(`export`);
  },

  async importItemPrice(ctx, { formData }) {
    return await masterItemPrice.post('import', formData, null, {
      'Content-Type': 'multipart/formdata',
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
