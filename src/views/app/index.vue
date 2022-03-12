<template>
  <app-layout>
    <SlideYDownTransition mode="out-in">
      <router-view />
    </SlideYDownTransition>
  </app-layout>
</template>

<script>
  import { SlideYDownTransition } from 'vue2-transitions';
  import AppLayout from '@/layouts/AppLayout';

  export default {
    components: {
      'app-layout': AppLayout,
      SlideYDownTransition,
    },
  };
</script>
