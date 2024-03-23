import ApiTwo from '../../../services/ApiTwo.service';

const rabApi = new ApiTwo({
  basePath: 'master/rab',
});

const state = {
  rabs: [],
};

const getters = {
  getMasterRabs: state => state.rabs,
};

const mutations = {
  setMasterRabs(state, rabs) {
    state.rabs = rabs;
  },
  clearRabs(state) {
    state.rabs = [];
  },
};

const actions = {
  async fetchMasterRab({ commit, state }, { query, queryCategory, provinceId = '' }) {
    const data = await rabApi
      .get('', `province=${provinceId}${query && queryCategory ? `&q=${query}&category=${queryCategory}` : ''}`);
    console.log(data)
    commit('setMasterRabs', data.data.data.rabs);
    return data;
  },

  async destroyMasterRab({ commit }, { projectId, rabId }) {
    await rabApi.get(`${rabId}/delete`);
  },

  async updateMasterRab({ commit }, { projectId, rabId, form }) {
    const data = await rabApi
      .post(rabId, form);
    return data;
  },

  async storeMasterRab({ commit }, { projectId, form }) {
    const data = await rabApi
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
