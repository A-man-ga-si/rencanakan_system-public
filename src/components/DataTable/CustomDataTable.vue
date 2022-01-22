<template>
  <b-card class="mb-4" :title="title || ''">
    <Vuetable
      id="project-table"
      ref="vuetable"
      :api-url="api"
      :fields="fields"
      :per-page="perPage"
      @vuetable:load-error="handleError"
      pagination-path
      :http-options="httpOptions"
      @vuetable:pagination-data="onPaginationData"
    >
      <template slot="actions" slot-scope="data">
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
  import { Notify } from 'notiflix';
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
      handleError(payload) {
        if (payload?.response?.status) {
          Notify.failure(
            "Failed to load data, user don't have right permission to access this data !"
          );
        }
      },
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

<style>
  #project-table thead {
    background-color: #00365a;
    border-radius: 20px !important;
    color: white;
  }

  #project-table thead th:hover {
    color: white !important;
  }

  #project-table thead th:first-child {
    border-radius: 20px 0 0 0 !important;
  }

  #project-table thead th:last-child {
    border-radius: 0 20px 0 0 !important;
  }
</style>
