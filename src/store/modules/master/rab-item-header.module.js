import ApiTwo from '@/services/ApiTwo.service';

const rabItemHeaderApi = new ApiTwo({
  basePath: 'item-header',
});

const state = {};

const getters = {};

const mutations = {};

const actions = {
  async storeMasterRabItemHeader(ctx, { rabId, form }) {
    const data = await rabItemHeaderApi
      .setPreviousPath(`master/rab/${rabId}`)
      .post('', form);
    return data;
  },
  async destroyMasterRabItemHeader(ctx, { rabId, masterRabItemHeader }) {
    const data = await rabItemHeaderApi
      .setPreviousPath(`master/rab/${rabId}`)
      .get(`${masterRabItemHeader}/delete`);
    return data;
  },
  async updateMasterRabItemHeader(ctx, { rabId, masterRabItemHeader, form }) {
    const data = await rabItemHeaderApi
      .setPreviousPath(`master/rab/${rabId}`)
      .post(`${masterRabItemHeader}`, form);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
