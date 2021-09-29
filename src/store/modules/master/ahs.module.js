import { queryAhs } from '../../../services/master/ahs.service';

const state = {
  ahs: [],
};

const getters = {
  getAhs: state => state.ahs,
};

const mutations = {
  setAhs(state, ahs) {
    state.ahs = ahs;
  },
};

const actions = {
  async fetchAhs({ commit }, province) {
    const data = await queryAhs('', `arrange=true&province=${province}`);
    commit('setAhs', data.data.data.ahs);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
