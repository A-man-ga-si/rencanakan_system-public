<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="'Admin Dashboard'" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <SlideXRightTransition mode="out-in">
          <router-view />
        </SlideXRightTransition>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
  import { SlideXRightTransition } from 'vue2-transitions';
  export default {
    components: {
      SlideXRightTransition,
    },
  };
</script>

<style scoped></style>
