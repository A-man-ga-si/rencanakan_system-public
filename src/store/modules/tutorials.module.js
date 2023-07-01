const state = {
  isInTutorial: true,
}

const getters = {
  isInTutorial: state => state.isInTutorial,
}

const mutations = {
  setInTutorial(state, val) {
    state.isInTutorial = val
  }
}

const actions = {
  changeInTutorial({ commit }, val) {
    commit('setInTutorial', val)
  }
}

export default {
  state, getters, mutations, actions,
}