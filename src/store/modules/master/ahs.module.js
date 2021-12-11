import ApiTwo from '../../../services/ApiTwo.service';

const masterAhsApi = new ApiTwo({
  previousPath: 'master',
  basePath: 'ahs',
});

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
    // prettier-ignore
    const data = await masterAhsApi.query('', `arrange=true&province=${province}`);
    commit('setAhs', data.data.data.ahs);
    return data;
  },

  async storeAhs(ctx, payload) {
    return await masterAhsApi.post('', payload);
  },

  async destroyAhs(ctx, ahsId) {
    return await masterAhsApi.get(`${ahsId}/delete`);
  },

  async updateAhs(ctx, { ahsId, form }) {
    return await masterAhsApi.post(`${ahsId}/update`, form);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
