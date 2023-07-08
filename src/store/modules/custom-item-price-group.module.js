import ApiTwo from '../../services/ApiTwo.service';

const customItemPriceGroupApi = new ApiTwo({
  basePath: 'custom-item-price-group',
});

const state = {
  customItemPriceGroups: [],
};

const getters = {
  getCustomItemPriceGroups: state => state.customItemPriceGroups
};

const mutations = {
  setCustomItemPriceGroup(state, val) {
    state.customItemPriceGroups = val
  }
};

const actions = {

  async getCustomItemPriceGroup({ commit }, { projectId }) {
    const data = await customItemPriceGroupApi.setPreviousPath(`project/${projectId}`).get('');
    commit('setCustomItemPriceGroup', data.data.data.customItemPriceGroups)
    return data
  },

  // prettier-ignore
  async storeCustomItemPriceGroup(ctx, { projectId, form }) {
    return await customItemPriceGroupApi.setPreviousPath(`project/${projectId}`).post('', form);
  },

  // prettier-ignore
  async destroyCustomItemPriceGroup(ctx, { projectId, customItemPriceGroupId }) {
    await customItemPriceGroupApi.setPreviousPath(`project/${projectId}`).get(`${customItemPriceGroupId}/delete`);
  },

  // prettier-ignore
  async updateCustomItemPriceGroup(ctx, { projectId, customItemPriceGroupId, form }) {
    await customItemPriceGroupApi
      .setPreviousPath(`project/${projectId}`)
      .post(customItemPriceGroupId, form);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
