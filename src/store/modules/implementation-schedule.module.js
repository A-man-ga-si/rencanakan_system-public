import ApiTwo from './../../services/ApiTwo.service';

const CustomImplementationSchedule = new ApiTwo({
  basePath: 'implementation-schedules',
});

const state = {
  implementationDurationSetting: null,
  implementationSchedules: [],
}

const getters = {
  getImplementationDurationSetting: state => state.implementationDurationSetting
}

const mutations = {
  setImplementationDurationSetting(state, implementationDurationSetting) {
    state.implementationDurationSetting = implementationDurationSetting
  },
}

const actions = {
  async updateImplementationScheduleDuration({ commit }, { projectId, implementationScheduleDuration }) {
    const data = await CustomImplementationSchedule
      .setPreviousPath(`project/${projectId}`)
      .post('update-project-duration', {
          implementation_duration: implementationScheduleDuration
      })
      commit('setImplementationDurationSetting', implementationScheduleDuration)
      return data.data
  },
  async getImplementationScheduleDuration({ commit }, { projectId }) {
    const data = await CustomImplementationSchedule
    .setPreviousPath(`project/${projectId}`)
    .get('implementation-schedule-duration')
    commit('setImplementationDurationSetting', data?.data?.data?.projectDuration || null)
  },
  async updateImplementationSchedule({ commit }, {projectId, implementationScheduleData}) {
    const data = await CustomImplementationSchedule.setPreviousPath(`project/${projectId}`).post('', implementationScheduleData)
    return data.data
  }
}

export default {
  state, getters, mutations, actions
}