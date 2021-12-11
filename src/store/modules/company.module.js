import ApiTwo from '../../services/ApiTwo.service';

const companyApi = new ApiTwo({
  basePath: 'company',
});

const state = {
  company: {},
};

const getters = {
  getCompany: state => state.company,
};

const mutations = {
  setCompany: (state, company) => (state.company = company),
};

const actions = {
  async addCompanyProfile({ commit }, payload) {
    const res = await companyApi.post('', payload);
    commit('setCompany', res.data.data.company);
    return res;
  },
  async updateCompany({ commit }, { companyId, form }) {
    const res = await companyApi.post(companyId, form);
    commit('setCompany', res.data.data.company);
    return res;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
