<template>
  <b-popover :target="target" :show.sync="isShow" v-if="isInTutorial && isShow">
    <template #title>{{ title }}</template>
    <slot />
    <div class="mt-2">
      <b-btn variant="primary" size="sm" class="mt-2" @click="onUnderstandButtonClicked">Mengerti</b-btn>
    </div>
  </b-popover>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    tutorialKey: {
      type: String,
      required: true,
    },
    endOfTutorial: {
      type: Boolean,
      default: false,
    },
    target: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['isInTutorial'])
  },
  methods: {
    ...mapActions(['changeInTutorial', 'endTutorial']),
    async onUnderstandButtonClicked() {
      this.$emit('understand');
      if (this.endOfTutorial) {
        await this.endTutorial(this.tutorialKey)
      } else {
        this.changeInTutorial(false)
      }
    },
  }
}
</script>