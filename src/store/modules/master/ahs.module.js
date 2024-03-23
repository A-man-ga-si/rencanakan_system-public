import ApiTwo from '../../../services/ApiTwo.service';

const masterAhsApi = new ApiTwo({
  previousPath: 'master',
  basePath: 'ahs',
});

const state = {
  ahs: [],
  ahsCount: 0,
  ahsIds: [],
};

const getters = {
  getAhs: state => state.ahs,
  getAhsIds: state => {
    state.ahsIds.map(d => {
      d.id_name = `${d.id} | ${d.name}`;
      return d;
    });
    return state.ahsIds;
  },
  getMappedAhsIds: state => {
    const groupedAhs = {}
    for (const ahs of state.ahsIds) {
      ahs.id_name = `${ahs.id} | ${ahs.name}`;
      if (!groupedAhs[ahs.groups]) {
        groupedAhs[ahs.groups] = [ahs]
      } else {
        groupedAhs[ahs.groups].push(ahs)
      }
    }
    return groupedAhs
  },
  getAhsCount: state => state.ahsCount,
};

const mutations = {
  setAhs(state, ahs) {
    state.ahs = ahs;
  },

  setAhsIds(state, ahsIds) {
    state.ahsIds = ahsIds;
  },

  setAhsCount(state, ahsCount) {
    state.ahsCount = ahsCount;
  },

  emptyAhs(state) {
    state.ahs = [];
  },
};

const actions = {
  async fetchAhs({ commit }, { province, page, perPage, selectedAhsGroup }) {
    // prettier-ignore
    const data = await masterAhsApi.query('', `arrange=true&province=${province}&page=${page}&per_page=${perPage}&selected_ahs_group=${selectedAhsGroup}`);
    commit('setAhs', data.data.data.ahs);
    commit('setAhsCount', data.data.data.pagination_attribute.total_rows);
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
    console.log('Ahs data', data)
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
