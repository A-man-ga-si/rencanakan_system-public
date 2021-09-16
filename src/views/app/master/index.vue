<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.account')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-alert variant="danger" :show="true" class="rounded">
          <b>Perhatian !</b>
          Menghapus data master bersifat destruktif ! harap konfirmasi dengan
          seksama sebelum menghapus
        </b-alert>
        <b-card class="mb-4 py-4">
          <SlideXRightTransition mode="out-in">
            <router-view />
          </SlideXRightTransition>
        </b-card>
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
