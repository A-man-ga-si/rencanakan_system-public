<template>
  <button
    @click.prevent="fabClick"
    class="floating-action-button bg-primary border-0 rounded-circle"
  >
    <ph-plus style="margin-top: -4px" />
  </button>
</template>

<script>
  import { PhPlus } from 'phosphor-vue';

  export default {
    methods: {
      fabClick(ref) {
        this.$emit('click', ref);
      },
    },
    components: {
      PhPlus,
    },
  };
</script>

<style scoped>
  .floating-action-button {
    position: fixed;
    right: 45px;
    bottom: 128px;
    width: 64px;
    height: 64px;
    font-size: 30px;
    z-index: 99;
  }

  @media only screen and (max-width: 600px) {
    .floating-action-button {
      right: 24px;
      bottom: 104px;
    }
  }
</style>
