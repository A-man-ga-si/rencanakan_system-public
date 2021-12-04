import {
  getCustomItemPrice,
  postCustomItemPrice,
} from '@/services/custom-item-price.service';

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
  async storeCustomItemPrice({ commit }, { projectId, form }) {
    const data = await postCustomItemPrice(
      `project/${projectId}/custom-item-price`,
      form
    );
    return data;
  },
  async deleteCustomItemPrice({ commit }, { projectId, customItemPriceCode }) {
    const data = await getCustomItemPrice(
      `project/${projectId}/custom-item-price/${customItemPriceCode}/delete`
    );
    return data;
  },
  async customItemPricePartialUpdate(
    ctx,
    { projectId, customItemPriceId, form }
  ) {
    const data = await postCustomItemPrice(
      `project/${projectId}/custom-item-price/${customItemPriceId}`,
      form
    );
    console.log(data);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
