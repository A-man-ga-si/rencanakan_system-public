<template>
  <div class="project-rab">
    <b-row>
      <b-colxx xxs="12">
        <b-row>
          <b-col :sm="10">
            <piaf-breadcrumb :heading="$t('menu.rab')" />
          </b-col>
          <b-col :sm="2" class="text-right">
            <b-btn variant="primary" @click.prevent="exportRab">
              {{ $t('pages.projects.rab.summary.export-btn') }}
            </b-btn>
          </b-col>
        </b-row>
        <div class="separator mb-5"></div>
        <b-alert variant="primary" show class="rounded">
          <i class="iconminds simple-icon-info mr-2"></i>
          <b>Perhatian : </b>Gunakan titik (.) sebagai koma
        </b-alert>
      </b-colxx>
    </b-row>
    <b-row>
      <b-col>
        <b-card>
          <b-nav pills>
            <b-nav-item :to="{ name: 'RabSummary' }">
              {{ $t('pages.projects.rab.rab-tab') }}
            </b-nav-item>
            <b-nav-item :to="{ name: 'RabAhs' }">
              {{ $t('pages.projects.rab.ahs-tab') }}
            </b-nav-item>
            <b-nav-item :to="{ name: 'ItemPrice' }">
              {{ $t('pages.projects.rab.unit-tab') }}
            </b-nav-item>
            <b-nav-item :to="{ name: 'RabAhp' }">
              {{ $t('pages.projects.rab.tools-price-tab') }}
            </b-nav-item>
          </b-nav>
          <router-view />
        </b-card>
      </b-col>
    </b-row>
    <ExportRab />
  </div>
</template>

<script>
  import ExportRab from '@/components/Project/ExportRab.vue';

  export default {
    methods: {
      exportRab() {
        this.$bvModal.show('export-rab');
      },
    },
    components: {
      ExportRab,
    },
  };
</script>

<style>
  .rab-card-single .heading,
  .ahs-card-single .heading,
  .item-price-card-single .heading {
    /* border-bottom: 1px solid #ddd; */
    padding-bottom: 7px;
  }
</style>
