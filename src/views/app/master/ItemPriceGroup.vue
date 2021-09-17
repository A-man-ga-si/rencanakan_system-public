<template>
  <div class="item-price-group">
    <div class="text-right mb-3">
      <b-btn v-b-modal.add-item-price-group variant="primary">
        {{ $t('pages.master.item-price-group.add-item-price-group') }}
      </b-btn>
    </div>
    <CustomDataTable
      ref="item-price-group-datatable"
      :api="itemPriceGroupAPI"
      title="Kelompok Harga Satuan"
      :fields="fields"
    >
      <template slot="actions" slot-scope="row">
        <EditButton @click.prevent="editUnit(row.row.rowData)" />
        <DeleteButton @click.prevent="deleteUnit(row.row.rowData.hashid)" />
      </template>
    </CustomDataTable>
    <EditItemPriceGroup
      @item-price-group-updated="reload"
      :selected-item-price-group="selectedItemPriceGroup"
    />
    <AddItemPriceGroup @item-price-group-added="reload" />
  </div>
</template>

<script>
  import AddItemPriceGroup from '@/components/Master/ItemPriceGroup/AddItemPriceGroup.vue';
  import EditItemPriceGroup from '@/components/Master/ItemPriceGroup/EditItemPriceGroup.vue';
  import CustomDataTable from '@/components/DataTable/CustomDataTable.vue';
  import itemPriceGroupField from '@/data/fields/item-price-group-field';
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';
  import { Notify } from 'notiflix';
  import { apiUrl } from '@/constants/config';
  import { mapActions } from 'vuex';
  import { showConfirmAlert } from '@/utils';

  export default {
    data: () => ({
      itemPriceGroupAPI: `${apiUrl}/master/item-price-group/`,
      fields: itemPriceGroupField,
      selectedItemPriceGroup: {},
    }),
    methods: {
      ...mapActions(['destroyItemPriceGroup']),
      async deleteUnit(id) {
        try {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Hapus Data Kelompok Harga Satuan ?',
            text: 'Aksi ini tidak dapat dibatalkan !',
          });
          if (isConfirmed) {
            await this.destroyItemPriceGroup(id);
            Notify.success('Berhasil menghapus satuan');
            this.reload();
          }
        } catch (err) {
          this.$notify('error', 'Gagal menghapus unit');
          console.error(err);
        }
      },
      editUnit(data) {
        this.$bvModal.show('edit-item-price-group');
        this.selectedItemPriceGroup = data;
      },
      reload() {
        this.$refs['item-price-group-datatable'].reloadTable();
      },
    },
    components: {
      AddItemPriceGroup,
      EditItemPriceGroup,
      CustomDataTable,
      EditButton,
      DeleteButton,
    },
  };
</script>
