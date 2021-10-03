import {
  getAhsItem,
  postAhsItem,
} from '../../../services/master/ahs-item.service';

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
  async storeAhsItem(ctx, { ahsId, form }) {
    const data = await postAhsItem(ahsId, form);
    return data;
  },
  async updateAhsItem(ctx, { ahsItemId, form }) {
    const data = await postAhsItem(`${ahsItemId}/update`, form);
    return data;
  },
  async deleteAhsItem(ctx, ahsItemId) {
    const data = await getAhsItem(`${ahsItemId}/delete`);
    console.log(data);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
