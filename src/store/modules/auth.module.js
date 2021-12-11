import ApiTwo from '../../services/ApiTwo.service';
import { setToken, setCurrentUser } from '../../utils';

const authApi = new ApiTwo({
  basePath: 'auth',
});

const state = {
  loginError: null,
  processing: false,
  isTokenVerified: false,
  forgotMailSuccess: null,
  resetPasswordSuccess: null,
  token: null,
};

const getters = {
  processing: state => state.processing,
  loginError: state => state.loginError,
  isTokenVerified: state => state.isTokenVerified,
  forgotMailSuccess: state => state.forgotMailSuccess,
  resetPasswordSuccess: state => state.resetPasswordSuccess,
};

const mutations = {
  setLogout(state) {
    state.currentUser = null;
    state.processing = false;
    state.loginError = null;
    state.isTokenVerified = false;
    state.token = null;
  },
  setProcessing(state, payload) {
    state.processing = payload;
    state.loginError = null;
  },
  setError(state, payload) {
    state.loginError = payload;
    state.currentUser = null;
    state.processing = false;
  },
  setForgotMailSuccess(state) {
    state.loginError = null;
    state.currentUser = null;
    state.processing = false;
    state.forgotMailSuccess = true;
  },
  setResetPasswordSuccess(state) {
    state.loginError = null;
    state.currentUser = null;
    state.processing = false;
    state.resetPasswordSuccess = true;
  },
  clearError(state) {
    state.loginError = null;
  },
  setToken(state, token) {
    state.token = token;
  },
  setTokenVerificationStatus(state, status) {
    state.isTokenVerified = status;
  },
};

const actions = {
  async login({ commit }, payload) {
    try {
      commit('clearError');
      commit('setProcessing', true);

      const res = await authApi.post('login', payload);

      const { user, token } = res.data.data;

      const userData = {
        id: user.hashid,
        img: user.photo,
        email: user.email,
        token_amount: user.token_amount,
        role: 0,
        permissions: user.roles[0].permissions?.map(e => e.name),
        title: `${user.first_name} ${user.last_name}`,
      };

      const parsedToken = token.plainTextToken.split('|')[1];

      setCurrentUser(userData);
      setToken(parsedToken);
      commit('setUser', userData);
      commit('setToken', parsedToken);
      commit('setCompany', user.company);

      return res;
    } catch (err) {
      throw err;
    } finally {
      commit('clearError');
      commit('setProcessing', false);
    }
  },
  async register({ commit }, payload) {
    try {
      commit('clearError');
      commit('setProcessing', true);
      return await authApi.post('register', payload);
    } catch (err) {
      throw err;
    } finally {
      commit('clearError');
      commit('setProcessing', false);
    }
  },
  async forgotPassword({ commit }, { email }) {
    try {
      commit('clearError');
      commit('setProcessing', true);
      const res = await authApi.post('forgot-password', { email });
      commit('setForgotMailSuccess', true);
      return res;
    } catch (err) {
      throw err;
    }
  },
  async verifyToken({ commit }) {
    try {
      const res = await authApi.post('verify');
      const user = res.data.data.user;
      const userData = {
        id: user.hashid,
        title: `${user.first_name} ${user.last_name}`,
        img: user.photo,
        email: user.email,
        permissions: user.roles[0].permissions?.map(e => e.name),
        token_amount: user.token_amount,
        role: 0,
      };
      setCurrentUser(userData);
      commit('setUser', userData);
      commit('setTokenVerificationStatus', true);
      commit('setCompany', user.company);
      return res;
    } catch (err) {
      setCurrentUser(null);
      setToken(null);
      commit('setLogout');
      throw err;
    }
  },
  async verifyResetPasswordToken(ctx, token) {
    return await authApi.post('reset-password/verify-token', {
      reset_password_token: token,
    });
  },
  async resetPassword({ commit }, { token, password, passwordConfirmation }) {
    const res = await authApi.post(`reset-password/${token}`, {
      password,
      password_confirmation: passwordConfirmation,
    });
    commit('setResetPasswordSuccess', true);
    return res;
  },
  async logout({ commit }) {
    const res = await authApi.post('logout');
    setCurrentUser(null);
    setToken(null);
    commit('setLogout');
    return res;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
