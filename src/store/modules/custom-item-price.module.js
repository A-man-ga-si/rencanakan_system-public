import ApiTwo from '../../services/ApiTwo.service';

const customItemPriceApi = new ApiTwo({
  basePath: 'custom-item-price',
});

const customItemPriceGroupApi = new ApiTwo({
  basePath: 'custom-item-price-group',
});

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
  clearCustomItemPrice(state) {
    state.customItemPrice = [];
  },
};

const actions = {
  flushCustemItemPrices({ commit }) {
    commit('clearCustomItemPrice');
  },

  // prettier-ignore
  async fetchCustomItemPrices({ commit }, projectId) {
    const data = await customItemPriceGroupApi.setPreviousPath(`project/${projectId}`).get();
    commit('setCustomItemPrice', data.data.data.customItemPriceGroups);
    return data;
  },

  // prettier-ignore
  async storeCustomItemPrice({ commit }, { projectId, form }) {
    return await customItemPriceApi.setPreviousPath(`project/${projectId}`).post('', form);
  },

  // prettier-ignore
  async deleteCustomItemPrice({ commit }, { projectId, customItemPriceCode }) {
    return await customItemPriceApi.setPreviousPath(`project/${projectId}`).get(`${customItemPriceCode}/delete`);
  },

  // prettier-ignore
  async customItemPricePartialUpdate(ctx, { projectId, customItemPriceId, form }) {
    return await customItemPriceApi.setPreviousPath(`project/${projectId}`).post(customItemPriceId, form);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
