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
    bottom: 46px;
    width: 60px;
    height: 60px;
    font-size: 30px;
    z-index: 99;
  }
</style>
