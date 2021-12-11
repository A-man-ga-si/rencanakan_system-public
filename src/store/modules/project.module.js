import ApiTwo from '../../services/ApiTwo.service';

const projectApi = new ApiTwo({
  basePath: 'project',
});

const state = {
  projects: [],
};

const getters = {
  getProjects: state => state.projects,
};

const mutations = {
  setProjects(state, projects) {
    state.projects = projects;
  },
  pushProject(state, project) {
    state.projects.push(project);
  },
};

const actions = {
  async showProject(ctx, projectId) {
    const data = await projectApi.get(projectId);
    return data;
  },

  // prettier-ignore
  async createProject({ commit }, { activity, address, name, job, fiscalYear: fiscal_year, marginProfit: profit_margin, provinceId: province_id, }) {
    const res = await projectApi.post('', {
      activity,
      address,
      name,
      fiscal_year,
      job,
      profit_margin,
      province_id,
    });
    commit('pushProject', res.data.data.project);
    return res;
  },

  async destroyProject(ctx, projectId) {
    return await projectApi.get(`${projectId}/delete`);
  },

  async updateProject(ctx, { projectId, form }) {
    return await projectApi.post(projectId, form);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
