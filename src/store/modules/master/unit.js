import { getUnit, postUnit } from '../../../services/master/unit.service';

const state = {};

const getters = {};

const mutations = {};

const actions = {
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
