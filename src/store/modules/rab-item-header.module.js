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
  async destroyRabItemHeader(ctx, { projectId, rabId, rabItemHeaderId }) {
    const data = await rabItemHeaderApi
      .setPreviousPath(`project/${projectId}/rab/${rabId}`)
      .get(`${rabItemHeaderId}/delete`);
    return data;
  },
  async updateRabItemHeader(ctx, { projectId, rabId, rabItemHeaderId, form }) {
    const data = await rabItemHeaderApi
      .setPreviousPath(`project/${projectId}/rab/${rabId}`)
      .post(`${rabItemHeaderId}`, form);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
