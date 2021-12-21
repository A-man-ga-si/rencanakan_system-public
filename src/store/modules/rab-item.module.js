import ApiTwo from '../../services/ApiTwo.service';

const RabItemApi = new ApiTwo({
  basePath: 'item',
});

const state = {};

const getters = {};

const mutations = {};

const actions = {
  async storeRabItem(ctx, { projectId, rabId, form }) {
    const data = await RabItemApi.setPreviousPath(
      `project/${projectId}/rab/${rabId}`
    ).post('', form);

    return data;
  },

  async destroyRabItem(ctx, { projectId, rabId, rabItemId }) {
    const data = await RabItemApi.setPreviousPath(
      `project/${projectId}/rab/${rabId}`
    ).get(`${rabItemId}/delete`);

    return data;
  },

  async updateRabItem(ctx, { projectId, rabId, rabItemId, form }) {
    const data = await RabItemApi.setPreviousPath(
      `project/${projectId}/rab/${rabId}`
    ).post(rabItemId, form);

    return data;
  },
};

export default { state, getters, mutations, actions };
