import { getCustomItemPrice } from '@/services/custom-item-price.service';

const state = {
  customItemPrice: [],
};

const getters = {
  getCustomItemPrice: state => state.customItemPrice,
};

const mutations = {
  setCustomItemPrice(state, customItemPrices) {
    state.customItemPrice = customItemPrices;
  },
};

const actions = {
  async fetchCustomItemPrices({ commit }, projectId) {
    const data = await getCustomItemPrice(
      `project/${projectId}/custom-item-price-group`
    );
    commit('setCustomItemPrice', data.data.data.customItemPriceGroups);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
