import ApiTwo from '../../../services/ApiTwo.service';

const masterAhsApi = new ApiTwo({
  previousPath: 'master',
  basePath: 'ahs',
});

const state = {
  ahs: [],
  ahsIds: [],
};

const getters = {
  getAhs: state => state.ahs,
  getAhsIds: state => state.ahsIds,
};

const mutations = {
  setAhs(state, ahs) {
    state.ahs = ahs;
  },

  setAhsIds(state, ahsIds) {
    state.ahsIds = ahsIds;
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

  async fetchAhsIds({ commit }) {
    const data = await masterAhsApi.get(`ids`);
    commit('setAhsIds', data.data.data.ahses);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
