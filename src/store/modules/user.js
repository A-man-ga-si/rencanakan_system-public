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
    forgotPassword({ commit }, { email }) {
      return new Promise((resolve, reject) => {
        commit('clearError');
        commit('setProcessing', true);
        axios
          .post(`${apiUrl}/auth/forgot-password`, {
            email,
          })
          .then(data => {
            commit('setForgotMailSuccess', true);
            resolve(data);
          })
          .catch(reject);
      });
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
            const {
              hashid,
              first_name,
              last_name,
              photo,
              roles,
              email,
              _active_company,
              token_amount,
              company,
            } = data.data.data.user;
            const userData = {
              id: hashid,
              img: photo,
              token_amount,
              _active_company,
              role: 0,
              email,
              permissions: roles[0].permissions?.map(e => e.name),
              title: `${first_name} ${last_name}`,
            };
            setCurrentUser(userData);
            commit('setUser', userData);
            commit('setTokenVerificationStatus', true);
            commit('setCompanies', company);
            commit('setActiveCompany', _active_company);
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
    verifyResetPasswordToken({ commit }, token) {
      return axios.post(`${apiUrl}/auth/reset-password/verify-token`, {
        reset_password_token: token,
      });
    },
    resetPassword({ commit }, { token, password, passwordConfirmation }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${apiUrl}/auth/reset-password/${token}`, {
            password,
            password_confirmation: passwordConfirmation,
          })
          .then(data => {
            commit('setResetPasswordSuccess', true);
            resolve(data);
          })
          .catch(reject);
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
            const {
              hashid,
              first_name,
              last_name,
              photo,
              roles,
              email,
              oldPassword,
              _active_company,
              token_amount,
              password,
              passwordConfirmation,
            } = data.data.data.user;
            const userData = {
              id: hashid,
              img: photo,
              role: 0,
              email,
              _active_company,
              token_amount,
              old_password: oldPassword,
              password,
              password_confirmation: passwordConfirmation,
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
    mutateToken({ commit }, token) {
      commit('setTokenAmount', token);
    },
  },
};
