import ApiTwo from './../../services/ApiTwo.service';

const CustomAhsApi = new ApiTwo({
  basePath: 'order',
});

const state = {
  orders: [],
};

const getters = {
  getOrders: state => state.orders,
};

const mutations = {
  setOrders(state, orders) {
    state.orders = orders;
  },
};

const actions = {
  async fetchOrders({ commit }) {
    const data = await CustomAhsApi.get();
    commit('setOrders', data?.data?.data?.orders);
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
