const state = {
  isSyncroning: false
}

const mutations = {
  setSynchroning: (state, isSyncroning) => state.isSyncroning = isSyncroning
}

const getters = {
  getSynchroning: state => state.isSyncroning
}

module.exports = {
  state, mutations, getters
}