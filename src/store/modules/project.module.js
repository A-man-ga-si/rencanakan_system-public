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
  createProject({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit('pushProject', data);
      resolve();
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
