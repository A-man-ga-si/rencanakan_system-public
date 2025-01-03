import ApiTwo from './../../services/ApiTwo.service';

const SubscriptionApi = new ApiTwo({
  basePath: 'subscriptions',
});

const state = {
  subscriptions: [],
};

const getters = {
  getSubscriptions: (state) => state.subscriptions,
};

const mutations = {
  setSubscriptions(state, subscriptions) {
    state.subscriptions = subscriptions;
  },
};

const actions = {
  async fetchSubscriptions({ commit, _ }) {
    const data = await SubscriptionApi.get();
    commit('setSubscriptions', data.data.data.subscriptions);
    return data.data.data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
