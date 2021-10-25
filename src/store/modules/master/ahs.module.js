import {
  queryAhs,
  postAhs,
  getAhs,
} from '../../../services/master/ahs.service';

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
  emptyAhs(state) {
    state.ahs = [];
  },
};

const actions = {
  async fetchAhs({ commit }, province) {
    // commit('emptyAhs');
    const data = await queryAhs('', `arrange=true&province=${province}`);
    commit('setAhs', data.data.data.ahs);
    return data;
  },
  async storeAhs(ctx, payload) {
    const data = await postAhs('', payload);
    return data;
  },
  async destroyAhs(ctx, ahsId) {
    const data = await getAhs(`${ahsId}/delete`);
    return data;
  },
  async updateAhs(ctx, { ahsId, form }) {
    const data = await postAhs(`${ahsId}/update`, form);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
