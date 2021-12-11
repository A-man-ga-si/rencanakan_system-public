import ApiTwo from '../../../services/ApiTwo.service';

const masterItemPriceGroup = new ApiTwo({
  previousPath: 'master',
  basePath: 'item-price-group',
});

const state = {
  itemPriceGroups: [],
};

const getters = {
  getPriceGroups: state => state.itemPriceGroups,
};

const mutations = {
  setItemPriceGroups(state, data) {
    state.itemPriceGroups = data;
  },
};

const actions = {
  async fetchItemPriceGroup({ commit }) {
    const data = await masterItemPriceGroup.query('', 'datatable=false');
    commit('setItemPriceGroups', data.data.data.itemPriceGroups);
    return data;
  },

  async storeItemPriceGroup(ctx, payload) {
    return await masterItemPriceGroup.post('', payload);
  },

  async destroyItemPriceGroup(ctx, id) {
    return await masterItemPriceGroup.get(`${id}/delete`);
  },

  async updateItemPriceGroup(ctx, { id, data: payload }) {
    return await masterItemPriceGroup.post(id, payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
