import {
  postItemPriceGroup,
  getItemPriceGroup,
  queryItemPriceGroup,
} from './../../../services/master/item-price-group.service';

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
    const data = await queryItemPriceGroup('', 'datatable=false');
    commit('setItemPriceGroups', data.data.data.itemPriceGroups);
    return data;
  },
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
  getters,
  mutations,
  actions,
};
