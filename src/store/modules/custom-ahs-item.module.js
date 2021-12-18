import ApiTwo from '@/services/ApiTwo.service';

const customAhsItemApi = new ApiTwo({
  basePath: 'custom-ahs-item',
});

const state = {
  customAhsItemableIds: [],
};

const getters = {
  getCustomAhsItemableIds: state => state.customAhsItemableIds,
};

const mutations = {
  setCustomAhsItemableIds(state, customAhsItemable) {
    state.customAhsItemableIds = customAhsItemable;
  },
};

const actions = {
  async fetchCustomAhsItemableIds({ commit }, { projectId }) {
    const data = await customAhsItemApi
      .setPreviousPath(`project/${projectId}`)
      .get('itemable-ids');
    commit('setCustomAhsItemableIds', data.data.data.customAhsItemableId);
    return data;
  },
  async storeCustomAhsItem(ctx, { projectId, form }) {
    const data = await customAhsItemApi
      .setPreviousPath(`project/${projectId}`)
      .post('', form);
  },
  async deleteCustomAhsItem(ctx, { projectId, customAhsItemId }) {
    await customAhsItemApi
      .setPreviousPath(`project/${projectId}`)
      .get(`${customAhsItemId}/delete`);
  },
  async updateCustomAhsItem(ctx, { projectId, customAhsItemId, form }) {
    const data = await customAhsItemApi
      .setPreviousPath(`project/${projectId}`)
      .post(customAhsItemId, form);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
