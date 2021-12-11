import ApiTwo from '../../../services/ApiTwo.service';

const masterUnitApi = new ApiTwo({
  previousPath: 'master',
  basePath: 'unit',
});

const state = {
  units: [],
};

const getters = {
  getUnit: state => state.units,
};

const mutations = {
  setUnits(state, data) {
    state.units = data;
  },
};

const actions = {
  async fetchUnit({ commit }) {
    const data = await masterUnitApi.query('', 'datatable=false');
    commit('setUnits', data.data.data.units);
    return data;
  },

  async storeUnit(ctx, { name }) {
    // prettier-ignore
    return await masterUnitApi.post('', { name });
  },
  async updateUnit(ctx, { id, data: payload }) {
    return await masterUnitApi.post(id, payload);
  },
  async destroyUnit(ctx, id) {
    return await masterUnitApi.get(`${id}/delete`);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
