<template>
  <div class="h-100">
    <router-view />
  </div>
</template>

<script>
  import { getDirection } from './utils';
  import { rounded } from './constants/config';

  export default {
    beforeMount() {
      const direction = getDirection();
      if (direction.isRtl) {
        document.body.classList.add('rtl');
        document.dir = 'rtl';
        document.body.classList.remove('ltr');
      } else {
        document.body.classList.add('ltr');
        document.dir = 'ltr';
        document.body.classList.remove('rtl');
      }
    },
    beforeMount() {
      if (rounded) document.body.classList.add('rounded');
    },
  };
</script>
