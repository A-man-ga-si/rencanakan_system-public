import axios from 'axios';
import { getProvinces } from './../../services/master/province.service';
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
  async fetchProvinces({ commit, state }) {
    if (state.provinces.length) return state.provinces;
    const data = await getProvinces();
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
