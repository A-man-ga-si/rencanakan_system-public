import ApiTwo from '../../../services/ApiTwo.service';

const masterAhpApi = new ApiTwo({
  previousPath: 'master',
  basePath: 'ahp',
});

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
    const data = await masterAhpApi.get();
    commit('setAhp', data.data.data);
    return data;
  },

  async storeAhp(ctx, payload) {
    const data = await masterAhpApi.post('', payload);
    return data;
  },

  async destroyAhp(ctx, id) {
    const data = await masterAhpApi.get(`${id}/delete`);
    return data;
  },

  async updateAhp(ctx, { ahpId, form }) {
    const data = await masterAhpApi.post(ahpId, form);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
