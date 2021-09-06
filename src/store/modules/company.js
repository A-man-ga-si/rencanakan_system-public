import axios from 'axios';
import { apiUrl } from '../../constants/config';
import { getToken } from '../../utils';

export default {
  state: {
    companies: [],
    activeCompany: null,
  },
  getters: {
    getCompanies: state => state.companies,
    getActiveCompany: state => state.activeCompany,
  },
  mutations: {
    setCompanies: (state, companies) => (state.companies = companies),
    addCompanies: (state, company) => state.companies.push(company),
    deleteCompany: (state, companyId) => {
      state.companies = state.companies.filter(data => {
        return data.id != companyId;
      });
    },
    setActiveCompany: (state, activeCompany) => {
      const filterCompanies = state.companies.filter(
        company => company.id == activeCompany.id
      );
      this.activeCompany =
        filterCompanies.length > 0 ? filterCompanies[0] : null;
    },
    setActiveCompany: (state, activeCompany) =>
      (state.activeCompany = activeCompany),
  },
  actions: {
    addCompanyProfile({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${apiUrl}/company`, payload, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          .then(data => {
            commit('addCompanies', data.data.data.company);
            resolve(data);
          })
          .catch(reject);
      });
    },
    setActiveCompany({ commit }, companyId) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${apiUrl}/company/${companyId}/set-active`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          .then(data => {
            const { companies, active_company } = data.data.data;
            commit('setCompanies', companies);
            commit('setActiveCompany', active_company);
            resolve(data);
          })
          .catch(reject);
      });
    },
    deleteCompany({ commit }, companyId) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${apiUrl}/company/${companyId}`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          .then(data => {
            commit('deleteCompany', companyId);
            resolve(data);
          })
          .catch(reject);
      });
    },
  },
};
