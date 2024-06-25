import ApiTwo from '../../../services/ApiTwo.service';

const RabItemApi = new ApiTwo({
  basePath: 'item',
});

const state = {};

const getters = {};

const mutations = {};

const actions = {
  async storeMasterRabItem(ctx, { rabId, form }) {
    const data = await RabItemApi.setPreviousPath(`master/rab/${rabId}`).post('', form);
    console.log(data)
    return data;
  },

  async destroyMasterRabItem(ctx, { rabId, rabItemId }) {
    const data = await RabItemApi.setPreviousPath(`master/rab/${rabId}`).get(`${rabItemId}/delete`);
    return data;
  },

  async updateMasterRabItem(ctx, { rabId, rabItemId, form }) {
    const data = await RabItemApi.setPreviousPath(`master/rab/${rabId}`).post(rabItemId, form);
    return data;
  },
};

export default { state, getters, mutations, actions };
