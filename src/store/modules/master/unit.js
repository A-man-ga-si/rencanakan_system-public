import { postUnit } from '../../../services/master/unit.service';

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
};

export default {
  state,
  getters,
  mutations,
  actions,
};
