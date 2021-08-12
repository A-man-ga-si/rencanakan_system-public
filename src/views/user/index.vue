<template>
  <user-layout>
    <SlideXLeftTransition mode="out-in">
      <router-view />
    </SlideXLeftTransition>
  </user-layout>
</template>

<script>
  import { SlideXLeftTransition } from 'vue2-transitions';
  import UserLayout from '../../layouts/UserLayout';

  export default {
    components: {
      'user-layout': UserLayout,
      SlideXLeftTransition,
    },
  };
</script>
