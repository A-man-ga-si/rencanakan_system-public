import ApiTwo from '../../../services/ApiTwo.service';

const masterAhsItemApi = new ApiTwo({
  previousPath: 'master',
  basePath: 'ahs-item',
});

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
    const data = await masterAhsItemApi.get('itemable-ids');
    commit('setAhsItemableIds', data.data.data.ahsItemableIds);
    return data;
  },

  async storeAhsItem(ctx, { ahsId, form }) {
    return await masterAhsItemApi.post(ahsId, form);
  },

  async updateAhsItem(ctx, { ahsItemId, form }) {
    return await masterAhsItemApi.post(`${ahsItemId}/update`, form);
  },

  async deleteAhsItem(ctx, ahsItemId) {
    return await masterAhsItemApi.get(`${ahsItemId}/delete`);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
