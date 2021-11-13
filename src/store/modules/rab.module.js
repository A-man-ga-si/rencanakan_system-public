import { getRab } from '../../services/rab.service';

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
    const data = await getRab(`project/${projectId}/rab`);
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
