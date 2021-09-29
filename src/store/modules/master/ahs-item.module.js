import { getAhsItem } from '../../../services/master/ahs-item.service';

const state = {
  ahsItemableIds: [],
};

const getters = {
  getAhsItemableIds: state => state.ahsItemableIds,
};

const mutations = {
  setAhsItemableIds(state, ahsItemableIds) {
    state.ahsItemableIds = ahsItemableIds;
  },
};

const actions = {
  async fetchAhsItemableIds({ commit }) {
    const data = await getAhsItem('itemable-ids');
    commit('setAhsItemableIds', data.data.data.ahsItemableIds);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
