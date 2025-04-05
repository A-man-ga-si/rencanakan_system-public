<template>
  <div class="item-price">
    <div class="mb-5 d-xl-flex justify-content-between">
  <div class="left d-flex">
    <div class="d-flex flex-column" style="width: 300px">
      <!-- ITEM GROUP DROPDOWN -->
      <div class="labeled-select position-relative mb-3">
        <span class="px-1">Kelompok Harga Satuan</span>
        <v-select label="name" :reduce="(itemGroup) => itemGroup.hashid" :options="itemPriceGroups" v-model="selectedItemGroup" />
      </div>

      <!-- NEW SEARCH TEXTFIELD -->
      <div class="labeled-select position-relative">
        <span class="px-1">Search</span>
        <input 
          type="text" 
          class="form-control" 
          v-model="searchedName"
          @blur="loadItemPrices"
          @keyup.enter="loadItemPrices"
        />
      </div>
    </div>

    <!-- PROVINCE DROPDOWN (Keeps its original position) -->
    <div class="labeled-select position-relative ml-md-3" style="width: 300px">
      <span class="px-1">Provinsi</span>
      <v-select label="name" :reduce="(province) => province.hashid" :options="provinces" v-model="selectedProvince" />
    </div>
  </div>
      <div class="right">
        <b-btn variant="outline-primary" @click="onTapExportButton">
          {{ $t('button.export') }}
        </b-btn>
        <b-btn variant="outline-primary" @click="onTapImportButton">
          {{ $t('button.import') }}
        </b-btn>
        <b-btn v-b-modal.add-item-price variant="primary" class="mr-1">
          {{ $t('pages.master.item-price.add-item-price') }}
        </b-btn>
      </div>
    </div>

    <!-- ITEM PRICE TABLE -->
    <SectionLoading
      v-if="itemPrices === undefined"
      title="Memuat Harga Satuan"
    />
    <div v-else class="d-flex" style="overflow-x: auto; flex-direction: column">
      <table class="table table-responsive-md shadow-sm w-100 mb-5">
        <thead>
          <th
            class="table-header"
            style="border-top-left-radius: 8px; width: 10%; min-width: 100px"
          >
            No.
          </th>
          <th class="table-header" style="width: 25%; min-width: 300px">
            Uraian
          </th>
          <th class="table-header" style="width: 15%; min-width: 150px">
            Satuan
          </th>
          <th class="table-header" style="width: 20%; min-width: 200px">
            Kode
          </th>
          <th class="table-header" style="width: 20%; min-width: 200px">
            Harga
          </th>
          <th
            class="table-header"
            style="border-top-right-radius: 8px; width: 10%; min-width: 125px"
          >
            Aksi
          </th>
        </thead>
        <tbody>
          <tr v-for="(itemPrice, index) in itemPrices" :key="itemPrice.id">
            <td>{{ (index + 1) + (pagination.limit * (pagination.currentPage - 1)) }}</td>
            <td>{{ itemPrice.name }}</td>
            <td>{{ itemPrice.unit.name }}</td>
            <td>{{ itemPrice.id }}</td>
            <!-- <td>{{ itemPrice.price }}</td> -->
            <td>{{ getFormattedCurrency(itemPrice.price) }}</td>
            <td>
              <EditButton @click.prevent="onClickEditButton(itemPrice)" />
              <DeleteButton @click.prevent="onClickDeleteButton(itemPrice)" />
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination
        class="mx-auto"
        :current-page="pagination.currentPage"
        :total-page="pagination.totalPage"
        :on-change-page="onChangePage"
      />
    </div>

    <!-- POPUPS -->
    <AddItemPrice @item-price-added="loadItemPrices" />
    <!-- !! TEMPORARY DISABLED -->
    <!-- <BatchUpdatePriceItemPrice
      @item-price-batch-updated="loadItemPrices"
      :item-prices="getUngroupedItemPrices"
    /> -->
    <EditItemPrice
      @item-price-updated="loadItemPrices"
      :selected-item-group="selectedItemGroup"
      :selected-item-price="selectedItemPrice"
    />
    <ImportExcelModal
      :id="this.importModalId"
      :title="$t('modal.import-master-data-title')"
      :subtitle="$t('modal.import-master-data-subtitle')"
      :fileAccept="'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'"
      :isLoading="false"
      :didFileSelected="didFileSelected"
    />
  </div>
</template>

<script>
  import moment from 'moment';
  import ImportExcelModal from '@/components/Common/ImportExcelModal';
  import AddItemPrice from '@/components/Master/ItemPrice/AddItemPrice.vue';
  import EditItemPrice from '@/components/Master/ItemPrice/EditItemPrice.vue';
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import BatchUpdatePriceItemPrice from '@/components/Master/ItemPrice/BatchUpdatePriceItemPrice';
  import { DeleteButton, EditButton } from '@/components/DataTable/Actions';
  import { SectionLoading, Pagination } from '@/components/Common';
  import { mapActions, mapGetters } from 'vuex';
  import { dateFormats, PAGINATION_DEFAULT_LIMIT } from '@/constants/config';
  import { formatCurrency, showConfirmAlert, Utils } from '@/utils';
  import { Notify } from 'notiflix';

  export default {
    data: () => ({
      ungroupedItemPrices: [],

      provinces: [],
      itemPriceGroups: undefined,
      itemPrices: undefined,
      
      selectedItemGroup: undefined,
      selectedProvince: undefined,
      selectedItemPrice: undefined,
      searchedName: null,

      pagination: {
        currentPage: 1,
        totalPage: 10,
        limit: PAGINATION_DEFAULT_LIMIT
      },

      form: { searchQuery: '' },
      importModalId: 'importItemPriceModal',
    }),
    async created() {
      await this.loadProvinces();
      await this.loadItemGroups();
    },
    methods: {
      ...mapActions([
        'exportItemPrice',
        'importItemPrice',
        'fetchProvinces',
        'fetchItemPrices',
        'fetchItemPriceGroup',
        'deleteItemPrice',
      ]),

      /* GET METHODS */
      getFormattedCurrency(val) {
        return `Rp. ${formatCurrency(val)}`;
      },

      /* API REQUEST METHODS */
      async loadProvinces() {
        const data = await this.fetchProvinces();
        this.provinces = data;
        this.selectedProvince = data[0].hashid;
      },
      async loadItemGroups() {
        const { data: response } = await this.fetchItemPriceGroup();
        this.itemPriceGroups = response.data.itemPriceGroups;
        if (this.itemPriceGroups.length > 0) {
          this.selectedItemGroup = this.itemPriceGroups[0].hashid;
        }
      },
      async loadItemPrices() {
        if (
          this.selectedProvince == undefined ||
          this.selectedItemGroup == undefined
        ) {
          return;
        }
        this.itemPrices = undefined;
        const { data: response } = await this.fetchItemPrices({
          provinceId: this.selectedProvince,
          groupId: this.selectedItemGroup,
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
          name: this.searchedName
        });
        this.itemPrices = response.data.item_prices;
        this.pagination.totalPage =
          response.data.pagination_attribute.total_page;
      },

      /* ACTION METHODS */
      async onClickEditButton(item) {
        this.selectedItemPrice = item;
        this.$bvModal.show('edit-item-price');
      },
      async onClickDeleteButton(item) {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus Data Harga Satuan ?',
          text: 'Aksi ini tidak dapat dibatalkan !',
        });
        if (isConfirmed) {
          try {
            await this.deleteItemPrice(item.id);
            Notify.success('Berhasil menghapus data harga satuan');
            this.loadItemPrices();
          } catch (err) {
            if (err.response) {
              Notify.failure(err.response.data.message);
            } else {
              Notify.failure('Gagal saat mencoba menghapus harga satuan');
            }
          }
        }
      },
      async onChangePage(page) {
        this.pagination.currentPage = page;
        this.loadItemPrices();
      },
      async onTapExportButton() {
        const response = await this.exportItemPrice();
        const currentDateStr = moment().format(dateFormats.excelFile);
        Utils.downloadFile(
          `Master_Harga_Satuan_${currentDateStr}.xlsx`,
          response.data,
        );
      },
      onTapImportButton() {
        this.$bvModal.show(this.importModalId);
      },
      async didFileSelected(file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          await this.importItemPrice({ formData });
          this.$bvModal.hide(this.importModalId);
          this.loadItemPrices();
        } catch (error) {
          if (error.response?.status == 400) {
            Notify.failure(error.response.data.message);
            return;
          }
          this.checkForInvalidResponse(error);
        }
      },
    },
    computed: {
      ...mapGetters(['getUngroupedItemPrices']),
    },
    watch: {
      selectedProvince() {
        this.loadItemPrices();
      },
      selectedItemGroup() {
        this.loadItemPrices();
      },
    },
    components: {
      SectionLoading,
      DeleteButton,
      Pagination,
      EditButton,
      AddItemPrice,
      ValidationInput,
      EditItemPrice,
      BatchUpdatePriceItemPrice,
      ImportExcelModal,
    },
  };
</script>

<style scoped>
  .table-header {
    background-color: #00365a;
    color: white;
  }
</style>
