<template>
  <div id="root">
    <div class="fixed-background"></div>
    <div class="blue-overlay"></div>
    <main>
      <div class="container">
        <slot></slot>
      </div>
    </main>
  </div>
</template>
<script>
  export default {
    mounted() {
      document.body.classList.add('background');
    },
    beforeDestroy() {
      document.body.classList.remove('background');
    },
  };
</script>

<style scoped>
  .blue-overlay {
    background-color: #0c293b;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.6;
  }
</style>
