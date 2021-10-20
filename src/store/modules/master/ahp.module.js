import { postAhp, getAhp } from '../../../services/master/ahp.service';

const state = {
  ahp: [],
};

const getters = {
  getAhp: state => state.ahp,
};

const mutations = {
  setAhp(state, ahp) {
    state.ahp = ahp;
  },
};

const actions = {
  async fetchAhp({ commit }) {
    const data = await getAhp();
    commit('setAhp', data.data.data);
    return data;
  },
  async storeAhp(ctx, payload) {
    const data = await postAhp('', payload);
    return data;
  },
  async destroyAhp(ctx, id) {
    const data = await getAhp(`${id}/delete`);
    return data;
  },
  async updateAhp(ctx, { ahpId, form }) {
    const data = await postAhp(ahpId, form);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
