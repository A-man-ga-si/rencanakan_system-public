import ApiTwo from '@/services/ApiTwo.service';

const rabItemHeaderApi = new ApiTwo({
  basePath: 'master/master-rab-categories',
});

const state = {
  masterRabCategories: [],
  selectedMasterRabCategory: {},
};

const getters = {
  getRabCategories: state => state.masterRabCategories,
  getSelectedRabCategory: state => state.selectedMasterRabCategory,
};

const mutations = {};

const actions = {
  async getMasterRabCategory({ state }) {
    const data = await rabItemHeaderApi.get();
    state.masterRabCategories = data.data.data.masterRabCategories
    return data;
  },
  async showMasterRabCategory({ state }, masterRabCategoryId) {
    const data = await rabItemHeaderApi.get(masterRabCategoryId);
    state.selectedMasterRabCategory = data.data.data.masterRabCategory
    return data;
  },
  async storeMasterRabCategory(ctx, { masterRabCategoryName }) {
    const data = await rabItemHeaderApi
      .post('', {
        name: masterRabCategoryName
      });
    return data;
  },
  async destroyMasterRabCategory(ctx, { masterRabCategoryId }) {
    const data = await rabItemHeaderApi
      .get(`${masterRabCategoryId}/delete`);
    return data;
  },
  async updateMasterRabCategory(ctx, { rabId, masterRabItemHeader, form }) {
    const data = await rabItemHeaderApi
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
