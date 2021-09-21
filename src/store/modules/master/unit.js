import {
  getUnit,
  postUnit,
  queryUnit,
} from '../../../services/master/unit.service';

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
    const data = await queryUnit('', 'datatable=false');
    commit('setUnits', data.data.data.units);
    return data;
  },
  async storeUnit(ctx, { name }) {
    const data = await postUnit('', {
      name,
    });
    return data;
  },
  async updateUnit(ctx, { id, data: payload }) {
    const data = await postUnit(id, payload);
    return data;
  },
  async destroyUnit(ctx, id) {
    const data = await getUnit(`${id}/delete`);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
