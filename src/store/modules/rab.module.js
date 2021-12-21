import ApiTwo from '../../services/ApiTwo.service';

const rabApi = new ApiTwo({
  basePath: 'rab',
});

const state = {
  rabs: [],
};

const getters = {
  getRabs: state => state.rabs,
};

const mutations = {
  setRabs(state, rabs) {
    state.rabs = rabs;
  },
};

const actions = {
  async fetchRab({ commit, state }, projectId) {
    const data = await rabApi.setPreviousPath(`project/${projectId}`).get();
    commit('setRabs', data.data.data.rabs);
    return data;
  },

  async destroyRab({ commit }, { projectId, rabId }) {
    await rabApi.setPreviousPath(`project/${projectId}`).get(`${rabId}/delete`);
  },

  async updateRab({ commit }, { projectId, rabId, form }) {
    const data = await rabApi
      .setPreviousPath(`project/${projectId}`)
      .post(rabId, form);
    return data;
  },

  async storeRab({ commit }, { projectId, form }) {
    const data = await rabApi
      .setPreviousPath(`project/${projectId}`)
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
