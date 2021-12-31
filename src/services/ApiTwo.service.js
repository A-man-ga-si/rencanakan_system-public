import axios from 'axios';
import { apiUrl } from '../constants/config';
import { getToken } from '../utils';

class ApiTwo {
  // prettier-ignore
  constructor({ basePath = '', previousPath = '', headers = {} }) {
    this.basePath = basePath;
    this.previousPath = previousPath;
    this.headers = headers;
  }

  setPreviousPath(previousPath) {
    this.previousPath = previousPath;
    return this;
  }

  query(path = '', query = null, headers = {}) {
    return axios.get(this.pathBuilder(path, query), {
      headers: this.includeToken(headers),
    });
  }

  get(path = '', query = '', headers = {}) {
    return axios.get(this.pathBuilder(path, query), {
      headers: this.includeToken(headers),
    });
  }

  post(path = '', data = {}, query = null, headers = {}) {
    return axios.post(this.pathBuilder(path, query), data, {
      headers: this.includeToken(headers),
    });
  }

  put(path = '', data = {}, query = null, headers = {}) {
    return axios.put(this.pathBuilder(path, query), data, {
      headers: this.includeToken(headers),
    });
  }

  patch(path = '', data = {}, query = null, headers = {}) {
    return axios.patch(this.pathBuilder(path, query), data, {
      headers: this.includeToken(headers),
    });
  }

  delete(path = '', query = '', headers = {}) {
    return axios.delete(this.pathBuilder(path, query), {
      headers: this.includeToken(headers),
    });
  }

  pathBuilder(path, query) {
    let buildPath = `${apiUrl}/`;
    buildPath += this.previousPath ? `${this.previousPath}/` : '';
    buildPath += `${this.basePath}/`;
    buildPath += encodeURI(path);

    buildPath = buildPath.replace(/\/$/, "");
    console.log(buildPath);

    if (query) {
      // prettier-ignore
      buildPath += `?${encodeURI(query)}`;
    }

    return buildPath;
  }

  includeToken(headers = {}) {
    if (getToken()) {
      headers.Authorization = `Bearer ${getToken()}`;
    }
    return headers;
  }
}

export default ApiTwo;
