import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(['tutorialList']),
  },
  methods: {
    ...mapActions(['changeInTutorial']),
    shouldShowTutorial(key) {
      for (const tutorialKey in this.tutorialList) {
        if (key == tutorialKey) return this.tutorialList[tutorialKey]
      }
    },
    activateTutorial() {
      this.changeInTutorial(true)
      return true
    }
  }
}