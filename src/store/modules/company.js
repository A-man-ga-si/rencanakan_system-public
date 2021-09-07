// prettier-ignore
import { deleteCompany, getCompany, postCompany } from '../../services/company.service';

const state = {
  companies: [],
  activeCompany: null,
};

const getters = {
  getCompanies: state => state.companies,
  getActiveCompany: state => state.activeCompany,
};

const mutations = {
  setCompanies: (state, companies) => (state.companies = companies),
  addCompanies: (state, company) => state.companies.push(company),
  deleteCompany: (state, companyId) => {
    state.companies = state.companies.filter(data => {
      return data.id != companyId;
    });
  },
  setActiveCompany: (state, activeCompany) => {
    // prettier-ignore
    const filterCompanies = state.companies.filter(company => company.id == activeCompany.id);
    this.activeCompany = filterCompanies.length > 0 ? filterCompanies[0] : null;
  },
  setActiveCompany: (state, activeCompany) =>
    (state.activeCompany = activeCompany),
};

const actions = {
  async addCompanyProfile({ commit }, payload) {
    const res = await postCompany('', payload);
    commit('addCompanies', res.data.data.company);
    return res;
  },
  async setActiveCompany({ commit }, companyId) {
    const res = await getCompany(`${companyId}/set-active`);
    const { companies, active_company } = res.data.data;
    commit('setCompanies', companies);
    commit('setActiveCompany', active_company);
    return res;
  },
  async deleteCompany({ commit }, companyId) {
    const res = await deleteCompany(companyId);
    commit('deleteCompany', companyId);
    return res;
  },
  async updateCompany({ commit }, { companyId, form }) {
    const res = await postCompany(companyId, form);
    console.log(res);
    return res;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
