import ApiTwo from './../../services/ApiTwo.service';

const CustomAhsApi = new ApiTwo({
  basePath: 'custom-ahs',
});

const state = {
  customAhs: [],
};

const getters = {
  getCustomAhs: state => state.customAhs,
};

const mutations = {
  setCustomAhs(state, customAhs) {
    state.customAhs = customAhs;
  },
};

const actions = {
  async fetchCustomAhs(ctx, { projectId }) {
    // prettier-ignore
    const data = await CustomAhsApi.setPreviousPath(`project/${projectId}`).get('', 'arrange=true');
    return data;
  },

  async fetchCustomAhsIds(ctx, { projectId }) {
    const data = await CustomAhsApi.setPreviousPath(`project/${projectId}`).get(
      'ids'
    );
    return data;
  },

  async storeCustomAhs(ctx, { projectId, form }) {
    // prettier-ignore
    const data = await CustomAhsApi.setPreviousPath(`project/${projectId}`).post('', form);
    return data;
  },

  async deleteCustomAhs(ctx, { projectId, customAhsId }) {
    const data = await CustomAhsApi.setPreviousPath(`project/${projectId}`).get(
      `${customAhsId}/delete`
    );
    return data;
  },

  async updateCustomAhs(ctx, { projectId, customAhsId, form }) {
    const data = await CustomAhsApi.setPreviousPath(
      `project/${projectId}`
    ).post(customAhsId, form);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
