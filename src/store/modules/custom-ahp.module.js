import ApiTwo from '../../services/ApiTwo.service';

const customAhpApi = new ApiTwo({
  basePath: 'custom-ahp',
});

const state = {};

const getters = {};

const mutations = {};

const actions = {
  async fetchCustomAhp(ctx, projectId) {
    const data = await customAhpApi
      .setPreviousPath(`project/${projectId}`)
      .get();
    return data;
  },
  async storeCustomAhp(ctx, { projectId, form }) {
    const data = await customAhpApi
      .setPreviousPath(`project/${projectId}`)
      .post('', form);
    return data;
  },
  async destroyCustomAhp(ctx, { projectId, customAhpId }) {
    await customAhpApi
      .setPreviousPath(`project/${projectId}`)
      .get(`${customAhpId}/delete`);
  },
  async updateCustomAhp(ctx, { customAhpId, projectId, form }) {
    const data = await customAhpApi
      .setPreviousPath(`project/${projectId}`)
      .post(customAhpId, form);
    return data;
  },
  async queryCustomAhp(ctx, { projectId, keyword }) {
    const data = await customAhpApi
      .setPreviousPath(`project/${projectId}`)
      .get('query', encodeURI(`q=${keyword}`));
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
