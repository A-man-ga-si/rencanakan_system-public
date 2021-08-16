import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import { currentUser, isAuthGuardActive, apiUrl } from '../../constants/config';
import {
  setCurrentUser,
  getCurrentUser,
  setToken,
  getToken,
  setCurrentUserPhoto,
} from '../../utils';

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
      state.currentUser.photo = photo;
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
  },
  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('clearError');
        commit('setProcessing', true);
        axios
          .post(`${apiUrl}/auth/login`, payload)
          .then(data => {
            const { user, token } = data.data.data;
            const userData = {
              id: user.hashid,
              img: user.photo,
              role: 0,
              permissions: user.roles[0].permissions?.map(e => e.name),
              title: `${user.first_name} ${user.last_name}`,
            };
            const parsedToken = token.plainTextToken.split('|')[1];
            setCurrentUser(userData);
            setToken(parsedToken);
            commit('setUser', userData);
            commit('setToken', parsedToken);
            resolve(data);
          })
          .catch(reject)
          .finally(() => {
            commit('clearError');
            commit('setProcessing', false);
          });
      });
    },
    register({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('clearError');
        commit('setProcessing', true);
        axios
          .post(`${apiUrl}/auth/register`, payload)
          .then(data => {
            resolve(data);
          })
          .catch(reject)
          .finally(() => {
            commit('clearError');
            commit('setProcessing', false);
          });
      });
    },
    forgotPassword({ commit }, payload) {
      commit('clearError');
      commit('setProcessing', true);
      firebase
        .auth()
        .sendPasswordResetEmail(payload.email)
        .then(
          user => {
            commit('clearError');
            commit('setForgotMailSuccess');
          },
          err => {
            commit('setError', err.message);
            setTimeout(() => {
              commit('clearError');
            }, 3000);
          }
        );
    },
    resetPassword({ commit }, payload) {
      commit('clearError');
      commit('setProcessing', true);
      firebase
        .auth()
        .confirmPasswordReset(payload.resetPasswordCode, payload.newPassword)
        .then(
          user => {
            commit('clearError');
            commit('setResetPasswordSuccess');
          },
          err => {
            commit('setError', err.message);
            setTimeout(() => {
              commit('clearError');
            }, 3000);
          }
        );
    },
    verifyToken({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${apiUrl}/auth/verify`,
            {},
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          )
          .then(data => {
            commit('setTokenVerificationStatus', true);
            resolve(data);
          })
          .catch(err => {
            setCurrentUser(null);
            setToken(null);
            commit('setLogout');
            reject(err);
          });
      });
    },
    signOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${apiUrl}/auth/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          )
          .then(res => {
            setCurrentUser(null);
            setToken(null);
            commit('setLogout');
            resolve(res);
          })
          .catch(reject);
      });
    },
    fetchUserInfo(ctx, userId) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${apiUrl}/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          .then(resolve)
          .catch(reject);
      });
    },
    updateUserInfo({ commit }, { userId, data }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${apiUrl}/user/${userId}`, data, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          .then(data => {
            const { hashid, first_name, last_name, photo, roles } =
              data.data.data.user;
            const userData = {
              id: hashid,
              img: photo,
              role: 0,
              permissions: roles[0].permissions?.map(e => e.name),
              title: `${first_name} ${last_name}`,
            };
            setCurrentUser(userData);
            commit('setUser', userData);
            resolve(data);
          })
          .catch(reject);
      });
    },
    updateUserPhoto({ commit }, { userId, formData }) {
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
  },
};
