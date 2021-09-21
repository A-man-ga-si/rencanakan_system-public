// prettier-ignore
import { postCompany } from '../../services/company.service';

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
    console.log(payload);
    const res = await postCompany('', payload);
    commit('setCompany', res.data.data.company);
    return res;
  },
  async updateCompany({ commit }, { companyId, form }) {
    const res = await postCompany(companyId, form);
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
