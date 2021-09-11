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

<style>
  .dark-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }
</style>
