import axios from 'axios';
import { apiUrl } from '../constants/config';
import { getToken } from './../utils';

const includeToken = (headers = {}) => {
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
  return headers;
};

export const query = (path, query = null, headers = {}) => {
  return axios.get(`${apiUrl}/${path}${query ? `?${query}` : ''}`, {
    headers: includeToken(headers),
  });
};

export const get = (path, query = '', headers = {}) => {
  return axios.get(`${apiUrl}/${path}${query ? `/${query}` : ''}`, {
    headers: includeToken(headers),
  });
};

export const post = (path, data = {}, headers = {}) => {
  return axios.post(`${apiUrl}/${path}`, data, {
    headers: includeToken(headers),
  });
};

export const put = (path, data = {}, headers = {}) => {
  return axios.put(`${apiUrl}/${path}`, data, {
    headers: includeToken(headers),
  });
};

export const patch = (path, data = {}, headers = {}) => {
  return axios.patch(`${apiUrl}/${path}`, data, {
    headers: includeToken(headers),
  });
};

export const del = (path, query = '', headers = {}) => {
  return axios.delete(`${apiUrl}/${path}${query ? `/${query}` : ''}`, {
    headers: includeToken(headers),
  });
};
