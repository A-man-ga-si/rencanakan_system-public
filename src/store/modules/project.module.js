import axios from 'axios';
import { apiUrl } from '../../constants/config';
import ApiTwo from '../../services/ApiTwo.service';
import { getToken } from '../../utils';

const projectApi = new ApiTwo({
  basePath: 'project',
  currentActiveProject: {},
});

const state = {
  projects: [],
};

const getters = {
  getProjects: state => state.projects,
  getCurrentActiveProject: state => state.currentActiveProject,
};

const mutations = {
  setProjects(state, projects) {
    state.projects = projects;
  },
  pushProject(state, project) {
    state.projects.push(project);
  },
  setCurrentActiveProject(state, project) {
    state.currentActiveProject = project
  },
};

const actions = {
  async showProject(_, projectId) {
    const data = await projectApi.get(projectId);
    return data;
  },

  async exportProject(ctx, { projectId }) {
    const res = await fetch(`${apiUrl}/project/${projectId}/export`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const resBlob = await res.blob();
    return resBlob;
  },

  // prettier-ignore
  async createProject({ commit }, { activity, address, name, job, fiscalYear: fiscal_year, marginProfit: profit_margin, provinceId: province_id, ppn, subscription_id}) {
    const res = await projectApi.post('', {
      activity,
      address,
      name,
      fiscal_year,
      job,
      profit_margin,
      province_id,
      ppn,
      subscription_id
    });
    commit('pushProject', res.data.data.project);
    return res;
  },

  async destroyProject(ctx, projectId) {
    return await projectApi.get(`${projectId}/delete`);
  },

  async renewProjectSubscription(ctx, projectId) {
    return await projectApi.post(`${projectId}/renew`)
  },

  async updateProject(ctx, { projectId, form }) {
    return await projectApi.post(projectId, form);
  },

  async markLastOpenedAt(ctx, { projectId }) {
    return await projectApi.get(`${projectId}/update-last-opened-at`);
  },

  async getMaterialSummary(ctx, { projectId }) {
    return await projectApi.get(`${projectId}/material-summary`);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
