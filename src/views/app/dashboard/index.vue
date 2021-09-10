<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.single')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 py-4">
          <UnderDevelopment />
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
  import UnderDevelopment from './../../../components/Common/UnderDevelopment.vue';

  export default {
    components: {
      UnderDevelopment,
    },
  };
</script>
