import ApiTwo from '@/services/ApiTwo.service';

const rabItemHeaderApi = new ApiTwo({
  basePath: 'item-header',
});

const state = {};

const getters = {};

const mutations = {};

const actions = {
  async storeRabItemHeader(ctx, { projectId, rabId, form }) {
    const data = await rabItemHeaderApi
      .setPreviousPath(`project/${projectId}/rab/${rabId}`)
      .post('', form);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
