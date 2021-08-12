<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.settings')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('menu.settings')"> </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
  import AppLayout from './../../../layouts/AppLayout.vue';

  export default {
    components: {
      AppLayout,
    },
  };
</script>
