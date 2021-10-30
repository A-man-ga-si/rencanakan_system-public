import { postProject } from '../../services/project.service';

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
  fetchProject() {},
  async createProject(
    { commit },
    {
      activity,
      address,
      name,
      job,
      fiscalYear: fiscal_year,
      marginProfit: profit_margin,
      provinceId: province_id,
    }
  ) {
    const res = await postProject('', {
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
};

export default {
  state,
  getters,
  mutations,
  actions,
};
