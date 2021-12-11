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
};

export default {
  state,
  getters,
  mutations,
  actions,
};
