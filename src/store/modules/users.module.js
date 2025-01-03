import ApiTwo from '../../services/ApiTwo.service';

const usersApi = new ApiTwo({
  basePath: 'users',
});

const state = {};
const getters = {};
const mutations = {};

const actions = {
  async fetchUsers(_, request) {
    let params = new URLSearchParams({
      limit: request.limit,
      search: request.search || '',
      page: request.page || 1,
    });
    if (request.sort !== undefined) {
      params.append('sort', request.sort);
    }
    const response = await usersApi.get('', params);
    return response.data;
  },
  async fetchUserDetail(_, userId) {
    const response = await usersApi.get(userId, '');
    return response.data.data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
