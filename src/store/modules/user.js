import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import { currentUser, isAuthGuardActive, apiUrl } from '../../constants/config';
import {
  setCurrentUser,
  getCurrentUser,
  setToken,
  getToken,
} from '../../utils';

export default {
  state: {
    currentUser: isAuthGuardActive ? getCurrentUser() : {},
    loginError: null,
    processing: false,
    isLoggedIn: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null,
    token: null,
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    getIsLoggedIn: state => state.isLoggedIn,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = false;
      state.loginError = null;
    },
    setLogout(state) {
      state.currentUser = null;
      state.processing = false;
      state.loginError = null;
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
    clearToken(state) {
      state.token = null;
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
      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(payload.email, payload.password)
      //   .then(
      //     user => {
      //       const item = { uid: user.user.uid, ...currentUser };
      //       setCurrentUser(item);
      //       commit('setUser', item);
      //     },
      //     err => {
      //       setCurrentUser(null);
      //       commit('setError', err.message);
      //       setTimeout(() => {
      //         commit('clearError');
      //       }, 3000);
      //     }
      //   );
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
            commit('setLogout');
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};
