import axios from 'axios';
import { isAuthGuardActive, apiUrl } from '../../constants/config';
import {
  setCurrentUser,
  getCurrentUser,
  setToken,
  getToken,
  setCurrentUserPhoto,
} from '../../utils';

import { postAuth, getAuth } from '../../services/auth.service';

export default {
  state: {
    currentUser: isAuthGuardActive ? getCurrentUser() : {},
    loginError: null,
    processing: false,
    isTokenVerified: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null,
    token: null,
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    isTokenVerified: state => state.isTokenVerified,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = false;
      state.loginError = null;
    },
    setUserPhoto(state, photo) {
      state.currentUser.img = photo;
    },
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
    setTokenAmount(state, tokenAmount) {
      state.currentUser.token_amount = tokenAmount;
    },
  },
  actions: {
    async login({ commit }, payload) {
      try {
        commit('clearError');
        commit('setProcessing', true);

        const res = await postAuth('login', payload);

        const { user, token } = res.data.data;

        const userData = {
          id: user.hashid,
          img: user.photo,
          email: user.email,
          token_amount: user.token_amount,
          role: 0,
          _active_company: user._active_company,
          permissions: user.roles[0].permissions?.map(e => e.name),
          title: `${user.first_name} ${user.last_name}`,
        };

        const parsedToken = token.plainTextToken.split('|')[1];

        setCurrentUser(userData);
        setToken(parsedToken);
        commit('setUser', userData);
        commit('setToken', parsedToken);
        commit('setCompanies', user.company);
        commit('setActiveCompany', user._active_company);

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
        return await postAuth('register', payload);
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
        const res = await postAuth('forgot-password', { email });
        commit('setForgotMailSuccess', true);
        return res;
      } catch (err) {
        throw err;
      }
    },
    async verifyToken({ commit }) {
      try {
        const res = await postAuth('verify');
        const user = res.data.data.user;
        const userData = {
          id: user.hashid,
          title: `${user.first_name} ${user.last_name}`,
          img: user.photo,
          email: user.email,
          permissions: user.roles[0].permissions?.map(e => e.name),
          token_amount: user.token_amount,
          _active_company: user._active_company,
          role: 0,
        };
        setCurrentUser(userData);
        commit('setUser', userData);
        commit('setTokenVerificationStatus', true);
        commit('setCompanies', user.company);
        commit('setActiveCompany', user._active_company);
        return res;
      } catch (err) {
        setCurrentUser(null);
        setToken(null);
        commit('setLogout');
        throw err;
      }
    },
    async verifyResetPasswordToken(ctx, token) {
      return await postAuth('reset-password/verify-token', {
        reset_password_token: token,
      });
    },
    async resetPassword({ commit }, { token, password, passwordConfirmation }) {
      const res = await postAuth(`reset-password/${token}`, {
        password,
        password_confirmation: passwordConfirmation,
      });
      commit('setResetPasswordSuccess', true);
      return res;
    },
    async logout({ commit }) {
      const res = await postAuth('logout');
      setCurrentUser(null);
      setToken(null);
      commit('setLogout');
      return res;
    },
    async fetchUserInfo(ctx, userId) {
      return await getAuth('user', userId);
    },
    async updateUserInfo({ commit }, { userId, data }) {
      const res = await postAuth(`user/${userId}`, data);
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
      resolve(data);
    },
    async updateUserPhoto({ commit }, { userId, formData }) {
      const res = await postAuth('user');
      return new Promise((resolve, reject) => {
        axios
          .post(`${apiUrl}/user/${userId}`, formData, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'multipart/formdata',
            },
          })
          .then(data => {
            const { photo } = data.data.data.user;
            commit('setUserPhoto', photo);
            setCurrentUserPhoto(photo);
            resolve(data);
          })
          .catch(reject);
      });
    },
    mutateToken({ commit }, token) {
      commit('setTokenAmount', token);
    },
  },
};
