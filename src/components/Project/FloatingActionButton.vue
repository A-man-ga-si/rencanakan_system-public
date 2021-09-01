<template>
  <button
    @click.prevent="fabClick"
    class="floating-action-button bg-primary border-0 rounded-circle"
  >
    <i class="iconsmind iconsminds-add m-0"></i>
  </button>
</template>

<script>
  export default {
    methods: {
      fabClick(ref) {
        this.$emit('click', ref);
      },
    },
  };
</script>

<style scoped>
  .floating-action-button {
    position: fixed;
    right: 60px;
    bottom: 46px;
    width: 60px;
    height: 60px;
    font-size: 30px;
    z-index: 99;
  }
</style>
