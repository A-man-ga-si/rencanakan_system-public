<template>
  <div class="unit">
    <div class="text-right mb-3">
      <b-btn v-b-modal.add-unit variant="primary">
        {{ $t('pages.master.unit.add-unit-bt') }}
      </b-btn>
    </div>
    <CustomDataTable
      api="https://api.coloredstrategies.com/cakes/fordatatable"
      title="Unit"
      component-ref="unit-table"
      sort-by="id"
      :fields="fields"
      :per-page="10"
      :total-rows="50"
    />
    <AddUnit />
  </div>
</template>

<script>
  import AddUnit from '@/components/Master/Unit/AddUnit';
  import CustomDataTable from '@/components/DataTable/CustomDataTable';

  export default {
    data: () => ({
      fields: [
        {
          key: 'id',
          label: '#',
          sortable: true,
          tdClass: 'list-item-heading',
        },
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          tdClass: 'list-item-heading',
        },
      ],
      localData: [
        {
          id: 1,
          name: 'OH',
        },
        {
          id: 2,
          name: 'CM3',
        },
      ],
      tabulator: null,
    }),
    methods: {},
    components: {
      AddUnit,
      CustomDataTable,
    },
  };
</script>
