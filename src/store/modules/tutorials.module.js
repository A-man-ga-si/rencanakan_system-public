import ApiTwo from '../../services/ApiTwo.service';

const tutorialApi = new ApiTwo({
  basePath: 'tutorials',
});

const state = {
  isInTutorial: false,
  tutorialList: [],
}

const getters = {
  isInTutorial: state => state.isInTutorial,
  tutorialList: state => state.tutorialList,
}

const mutations = {
  setInTutorial(state, val) {
    state.isInTutorial = val
  },
  setTutorialList(state, val) {
    state.tutorialList = val
  },
  updateTutorialItem(state, { key, val }) {
    console.log('Updating....')
    console.log('Before : ')
    console.log(state.tutorialList[key])
    state.tutorialList[key] = val
    console.log('After : ')
    console.log(state.tutorialList[key])
  }
}

const actions = {
  changeInTutorial({ commit }, val) {
    commit('setInTutorial', val)
  },
  async getTutorialLists({ commit }) {
    const data = await tutorialApi.get();
    commit('setTutorialList', data.data.data);
    return data;
  },
  async endTutorial({ commit }, key) {
    console.log(key)
    commit('setInTutorial', false)
    commit('updateTutorialItem', {
      key,
      val: 0,
    })
    await tutorialApi.post('update', {
      key,
      val: false
    });
  }
}

export default {
  state, getters, mutations, actions,
}