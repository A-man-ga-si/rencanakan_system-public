<template>
  <div class="item-price">
    <div class="mb-3 d-flex justify-content-between">
      <div class="left">
        <div
          class="labeled-select position-relative d-inline-block"
          style="width: 300px"
        >
          <span class="px-1"> Provinsi</span>
          <v-select
            label="name"
            :reduce="province => province.hashid"
            :options="provinces"
            v-model="selectedProvince"
          />
        </div>
      </div>
      <div class="right">
        <b-btn
          variant="outline-primary"
          @click="onTapExportButton"
        >
          {{ $t('button.export') }}
        </b-btn>
        <b-btn
          variant="outline-primary"
          @click="onTapImportButton"
        >
          {{ $t('button.import') }}
        </b-btn>
        <b-btn
          @click="loadUngroupedItemPrice"
          v-b-modal.batch-update-price-modal
          variant="outline-primary"
          class="mr-1"
        >
          {{ $t('pages.master.item-price.add-item-price-batch') }}
        </b-btn>
        <b-btn v-b-modal.add-item-price variant="primary" class="mr-1">
          {{ $t('pages.master.item-price.add-item-price') }}
        </b-btn>
      </div>
    </div>
    <ItemPriceItem
      v-for="(itemPriceGroup, idx) in itemPriceGroups"
      :key="idx"
      :idx="idx"
      :active-province="selectedProvince"
      :item="itemPriceGroup"
      @edit-item-clicked="editItem"
      @item-deleted="loadItemPrices"
    />
    <AddItemPrice @item-price-added="loadItemPrices" />
    <BatchUpdatePriceItemPrice
      @item-price-batch-updated="loadItemPrices"
      :item-prices="getUngroupedItemPrices"
    />
    <EditItemPrice
      @item-price-updated="loadItemPrices"
      :selected-item-price="edit.selectedItemPrice"
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
  import ItemPriceItem from '@/components/Master/ItemPrice/ItemPriceItem.vue';
  import AddItemPrice from '@/components/Master/ItemPrice/AddItemPrice.vue';
  import EditItemPrice from '@/components/Master/ItemPrice/EditItemPrice.vue';
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import BatchUpdatePriceItemPrice from '@/components/Master/ItemPrice/BatchUpdatePriceItemPrice';
  import { mapActions, mapGetters } from 'vuex';
  import { dateFormats } from '@/constants/config';
  import { Utils } from '@/utils';
  import { Notify } from 'notiflix';

  export default {
    data: () => ({
      ungroupedItemPrices: [],
      itemPriceGroups: [],
      provinces: [],
      selectedProvince: '',
      edit: { selectedItemPrice: {} },
      form: { searchQuery: '' },
      importModalId: 'importItemPriceModal'
    }),
    async created() {
      await this.loadProvinces();
    },
    methods: {
      // TODO: Make provinces fetches more efficient
      ...mapActions([
        'exportItemPrice',
        'importItemPrice',
        'fetchProvinces',
        'fetchItemPrices',
        'fetchUngroupedItemPrices',
      ]),
      async loadProvinces() {
        const data = await this.fetchProvinces();
        this.provinces = data;
        this.selectedProvince = data[0].hashid;
      },
      async loadItemPrices() {
        const { data } = await this.fetchItemPrices(this.selectedProvince);
        this.itemPriceGroups = data.data.itemPrices;
      },
      async editItem(item) {
        this.edit.selectedItemPrice = item;
        this.$bvModal.show('edit-item-price');
      },
      async loadUngroupedItemPrice() {
        const data = await this.fetchUngroupedItemPrices();
      },
      async onTapExportButton() {
        const response = await this.exportItemPrice();
        const currentDateStr = moment().format(dateFormats.excelFile); 
        Utils.downloadFile(`Master_Harga_Satuan_${currentDateStr}.xlsx`, response.data);
      },
      onTapImportButton() {
        this.$bvModal.show(this.importModalId);
      },
      async didFileSelected(file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          await this.importItemPrice({formData});
          this.$bvModal.hide(this.importModalId);
          this.loadItemPrices();
        } catch (error){
          if (error.response?.status == 400) {
            Notify.failure(error.response.data.message);
            return
          }
          this.checkForInvalidResponse(error);
        }
      }
    },
    computed: {
      ...mapGetters(['getUngroupedItemPrices']),
    },
    watch: {
      selectedProvince() {
        this.loadItemPrices();
      },
    },
    components: {
      ItemPriceItem,
      AddItemPrice,
      ValidationInput,
      EditItemPrice,
      BatchUpdatePriceItemPrice,
      ImportExcelModal
    },
  };
</script>
