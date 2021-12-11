import ApiTwo from '../../services/ApiTwo.service';
import { isAuthGuardActive } from '../../constants/config';
// prettier-ignore
import { setCurrentUser, getCurrentUser, setCurrentUserPhoto } from '../../utils';

const userApi = new ApiTwo({
  basePath: 'user',
});

const state = {
  currentUser: isAuthGuardActive ? getCurrentUser() : {},
};

const getters = {
  currentUser: state => state.currentUser,
};

const mutations = {
  setUser(state, payload) {
    state.currentUser = payload;
    state.processing = false;
    state.loginError = null;
  },
  setUserPhoto(state, photo) {
    state.currentUser.img = photo;
  },
  setTokenAmount(state, tokenAmount) {
    state.currentUser.token_amount = tokenAmount;
  },
};

const actions = {
  async fetchUserInfo(ctx, userId) {
    return await userApi.get(userId, '');
  },
  async updateUserInfo({ commit }, { userId, data }) {
    const res = await userApi.post(userId, data);
    const user = res.data.data.user;
    const userData = {
      id: user.hashid,
      img: user.photo,
      role: 0,
      email: user.email,
      _active_company: user._active_company,
      token_amount: user.token_amount,
      old_password: user.oldPassword,
      password: user.password,
      password_confirmation: user.passwordConfirmation,
      permissions: user.roles[0].permissions?.map(e => e.name),
      title: `${user.first_name} ${user.last_name}`,
    };
    setCurrentUser(userData);
    commit('setUser', userData);
    return res;
  },
  async updateUserPhoto({ commit }, { userId, formData }) {
    const res = await userApi.post(userId, formData, null, {
      'Content-Type': 'multipart/formdata',
    });
    const { photo } = res.data.data.user;
    commit('setUserPhoto', photo);
    setCurrentUserPhoto(photo);
    return res;
  },
  mutateToken({ commit }, token) {
    commit('setTokenAmount', token);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
