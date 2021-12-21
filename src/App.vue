<template>
  <div class="h-100">
    <router-view />
  </div>
</template>

<script>
  import { rounded } from './constants/config';

  export default {
    beforeMount() {
      if (rounded) document.body.classList.add('rounded');
    },
  };
</script>

<style>
  .pace .pace-progress {
    height: 3px !important;
    background-color: #165079 !important;
  }

  .custom-nice-border {
    border: 2px solid rgba(240, 240, 240, 1);
    border-radius: 10px;
  }
</style>
