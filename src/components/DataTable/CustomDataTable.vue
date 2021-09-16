<template>
  <b-card class="mb-4" :title="title || ''">
    <b-table
      :ref="componentRef"
      class="vuetable"
      :sort-by="sortBy"
      sort-desc.sync="false"
      selectable
      :current-page="tableAttributes.currentPage"
      :fields="fields"
      :items="dataProvider"
    >
    </b-table>
    <b-pagination
      size="sm"
      align="center"
      :total-rows="totalRows"
      :per-page="perPage"
      v-model="tableAttributes.currentPage"
    >
      <template v-slot:next-text>
        <i class="simple-icon-arrow-right" />
      </template>
      <template v-slot:prev-text>
        <i class="simple-icon-arrow-left" />
      </template>
      <template v-slot:first-text>
        <i class="simple-icon-control-start" />
      </template>
      <template v-slot:last-text>
        <i class="simple-icon-control-end" />
      </template>
    </b-pagination>
  </b-card>
</template>

<script>
  export default {
    props: [
      'title',
      'componentRef',
      'sortBy',
      'fields',
      'perPage',
      'totalRows',
      'api',
    ],
    data: () => ({
      tableAttributes: {
        currentPage: 1,
      },
    }),
    methods: {
      apiParamsConverter(params) {
        let apiParams = {};
        if (params.perPage !== 0) {
          apiParams.per_page = params.perPage;
        }
        if (params.currentPage >= 1) {
          apiParams.page = params.currentPage;
        }
        if (params.sortBy && params.sortBy.length > 0) {
          apiParams.sort = `${params.sortBy}|${
            params.sortDesc ? 'desc' : 'asc'
          }`;
        }
        if (params.filter && params.filter.length > 0) {
          // Optional
        }
        return apiParams;
      },
      dataProvider(ctx) {
        const params = this.apiParamsConverter(ctx);
        let promise = axios.get(this.api, {
          params: params,
        });

        return promise
          .then(result => result.data)
          .then(data => {
            this.currentPage = data.current_page;
            this.perPage = data.per_page;
            this.totalRows = data.total;
            const items = data.data;
            return items;
          })
          .catch(_error => {
            return [];
          });
      },
    },
  };
</script>
