import axios from 'axios';
import { apiUrl } from '../constants/config';
import { getToken } from './../utils';

const includeToken = (headers = {}) => {
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
  return headers;
};

export const query = (path, query = null) => {
  return axios.get(`${apiUrl}/${path}${query ? `?${query}` : ''}`, {
    headers: includeToken(),
  });
};

export const get = (path, query = '') => {
  return axios.get(`${apiUrl}/${path}/${query}}`, {
    headers: includeToken(),
  });
};

export const post = (path, data = {}) => {
  return axios.post(`${apiUrl}/${path}`, data, {
    headers: includeToken(),
  });
};

export const put = (path, data = {}) => {
  return axios.put(`${apiUrl}/${path}`, data, {
    headers: includeToken(),
  });
};

export const patch = (path, data = {}) => {
  return axios.patch(`${apiUrl}/${path}`, data, {
    headers: includeToken(),
  });
};

export const del = (path, query = '') => {
  return axios.delete(`${apiUrl}/${path}/${query}`, {
    headers: includeToken(),
  });
};
