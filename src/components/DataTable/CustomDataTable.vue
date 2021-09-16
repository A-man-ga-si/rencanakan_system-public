<template>
  <b-card class="mb-4" :title="title || ''">
    <Vuetable
      ref="vuetable"
      :api-url="api"
      :fields="fields"
      :per-page="perPage"
      pagination-path
      :http-options="httpOptions"
      @vuetable:pagination-data="onPaginationData"
    >
      <template slot="actions" scope="data">
        <slot name="actions" :row="data" />
      </template>
    </Vuetable>
    <VuetablePaginationBootstrap
      ref="pagination"
      @vuetable-pagination:change-page="onChangePage"
    />
  </b-card>
</template>

<script>
  import Vuetable from 'vuetable-2';
  import VuetablePaginationBootstrap from './../Common/VuetablePaginationBootstrap.vue';
  import { getToken } from '../../utils';

  export default {
    props: ['title', 'fields', 'api'],
    data: () => ({
      perPage: 10,
      tableAttributes: {
        currentPage: 1,
        perPage: 0,
        totalRows: 0,
      },
      httpOptions: {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    }),
    methods: {
      onPaginationData(paginationData) {
        this.$refs.pagination.setPaginationData(paginationData);
      },
      onChangePage(page) {
        this.$refs.vuetable.changePage(page);
      },
      reloadTable() {
        this.$refs.vuetable.reload();
      },
    },
    components: {
      Vuetable,
      VuetablePaginationBootstrap,
    },
  };
</script>
