import ApiTwo from '../../services/ApiTwo.service';

const baseApi = new ApiTwo({
  basePath: 'admin/projects',
});

const state = {};
const getters = {};
const mutations = {};

const actions = {
  async fetchUserProjects(_, request) {
    const params = new URLSearchParams({
      user_hash_id: request.userHashId,
      page: request.page || 1,
      limit: request.limit || 10,
    });
    const response = await baseApi.get('', params);
    return response.data;
  },
  async putAdminProject(_, request) {
    const response = await baseApi.put(request.hashId, {
      name: request.name,
      subscription_id: request.subscriptionId,
      expired_at: request.expiredDate,
    });
    return response.data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
