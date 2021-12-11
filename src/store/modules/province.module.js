import ApiTwo from '../../services/ApiTwo.service';

const provinceApi = new ApiTwo({
  basePath: 'provinces',
});

const state = {
  provinces: [],
};

const getters = {
  getProvinces: state => state.provinces,
};

const mutations = {
  setProvinces(state, provinces) {
    state.provinces = provinces;
  },
};

const actions = {
  async fetchProvinces({ commit, state }) {
    if (state.provinces.length) return state.provinces;
    const data = await provinceApi.get();
    commit('setProvinces', data.data.data.provinces);
    return data.data.data.provinces;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
