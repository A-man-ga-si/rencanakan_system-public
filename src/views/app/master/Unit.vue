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
      <template slot="actions" scope="row">
        <a
          href=""
          class="text-primary mr-2"
          @click.prevent="editUnit(row.row.rowData.hashid)"
        >
          <i class="simple-icon-pencil"></i>
        </a>
        <a
          href=""
          class="text-danger"
          @click.prevent="deleteUnit(row.row.rowData.hashid)"
        >
          <i class="simple-icon-trash"></i>
        </a>
      </template>
    </CustomDataTable>
    <AddUnit @unit-added="reload" />
  </div>
</template>

<script>
  import AddUnit from '@/components/Master/Unit/AddUnit';
  import CustomDataTable from '@/components/DataTable/CustomDataTable';
  import unitTableFields from './../../../data/fields/unit-table-field';
  import { apiUrl } from '../../../constants/config';
  import { showConfirmButton } from '../../../utils';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    data: () => ({
      fetchUnitAPI: `${apiUrl}/master/unit`,
      fields: unitTableFields,
    }),
    methods: {
      ...mapActions(['destroyUnit']),
      reload() {
        this.$refs['unit-data-table'].reloadTable();
      },
      async deleteUnit(id) {
        try {
          const { isConfirmed } = await showConfirmButton({
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
      editUnit(id) {
        console.log(`Editing unit ${id}`);
      },
    },
    components: {
      AddUnit,
      CustomDataTable,
    },
  };
</script>
