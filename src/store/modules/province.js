import axios from 'axios';
import { apiProvinces } from '../../constants/config';

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
  fetchProvinces({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios
        .get(apiProvinces)
        .then(data => {
          commit('setProvinces', data.data);
          resolve(data);
        })
        .catch(reject);
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
