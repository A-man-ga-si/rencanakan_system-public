<template>
  <div class="unit">
    <div class="text-right mb-3">
      <b-btn v-b-modal.add-unit variant="primary">
        {{ $t('pages.master.unit.add-unit-bt') }}
      </b-btn>
    </div>
    <CustomDataTable
      ref="unit-data-table"
      :api="fetchUnitAPI"
      title="Daftar Satuan"
      :fields="fields"
    >
      <template slot="actions" slot-scope="row">
        <EditButton @click.prevent="editUnit(row.row.rowData)" />
        <DeleteButton @click.prevent="deleteUnit(row.row.rowData.hashid)" />
      </template>
    </CustomDataTable>
    <AddUnit @unit-added="reload" />
    <EditUnit :selected-unit="selectedUnit" @unit-updated="reload" />
  </div>
</template>

<script>
  import AddUnit from '@/components/Master/Unit/AddUnit';
  import EditUnit from '@/components/Master/Unit/EditUnit';
  import CustomDataTable from '@/components/DataTable/CustomDataTable';
  import unitTableFields from './../../../data/fields/unit-table-field';
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';
  import { apiUrl } from '../../../constants/config';
  import { showConfirmAlert } from '../../../utils';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    data: () => ({
      fetchUnitAPI: `${apiUrl}/master/unit`,
      selectedUnit: {},
      fields: unitTableFields,
    }),
    methods: {
      ...mapActions(['destroyUnit']),
      reload() {
        this.$refs['unit-data-table'].reloadTable();
      },
      async deleteUnit(id) {
        try {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Hapus Data Satuan ?',
            text: 'Aksi ini tidak dapat dibatalkan !',
          });
          if (isConfirmed) {
            await this.destroyUnit(id);
            Notify.success('Berhasil menghapus satuan');
            this.reload();
          }
        } catch (err) {
          this.$notify('error', 'Gagal menghapus unit');
          console.error(err);
        }
      },
      editUnit(data) {
        this.$bvModal.show('edit-unit');
        this.selectedUnit = data;
      },
    },
    components: {
      AddUnit,
      CustomDataTable,
      EditUnit,
      EditButton,
      DeleteButton,
    },
  };
</script>
