<template>
  <div>
    <b-row class="">
      <b-col :lg="6" :xl="3">
        <div class="text-right mb-2 position-relative">
          <label class="form-group has-float-label mb-0">
            <input
              v-model="form.searchQuery"
              type="text"
              class="form-control"
            />
            <span> Search </span>
          </label>
          <i
            class="simple-icon-magnifier position-absolute bg-white"
            style="top: 11px; right: 10px"
          />
        </div>
      </b-col>
      <b-col>
        <b-form-group horizontal>
          <b-form-radio-group
            class="pt-2"
            :options="searchQueryOptions"
            v-model="form.searchQueryCategory"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <ItemPriceItem
      v-for="(itemPriceGroup, idx) in getCustomItemPrice"
      :key="idx"
      :units="getUnit"
      :item-price-group="itemPriceGroup"
      :title="itemPriceGroup.name"
      :index="idx"
      @custom-item-price-group-deleted="reloadData"
      @custom-item-price-added="reloadData"
      @custom-item-price-deleted="reloadData"
      @edit-bt-custom-item-price-group-clicked="fillEditData"
    />
    <FloatingActionButton @click="showAddItemPriceDialog" />
    <AddItemPriceGroup @custom-item-price-group-added="reloadData" />
    <EditItemPriceGroup
      :edited-data="editedItemPriceGroup"
      @custom-item-price-group-updated="reloadData"
    />
  </div>
</template>

<script>
  import ItemPriceItem from '@/components/Project/Rab/ItemPriceItem.vue';
  import FloatingActionButton from '@/components/Project/FloatingActionButton.vue';
  import AddItemPriceGroup from '@/components/Project/Rab/AddItemPriceGroup.vue';
  import EditItemPriceGroup from '@/components/Project/Rab/EditItemPriceGroup.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        editedItemPriceGroup: {},
        form: {
          searchQueryCategory: 'item',
          searchQuery: '',
        },
        searchQueryOptions: [
          { text: 'Nama Barang', value: 'item' },
          { text: 'Kategori', value: 'header' },
        ],
        searchCountdownObject: null,
      };
    },
    created() {
      this.fetchCustomItemPrices(this.$route.params.id);
      this.fetchUnit();
    },
    methods: {
      ...mapActions([
        'fetchCustomItemPrices',
        'queryCustomItemPrices',
        'fetchUnit',
      ]),
      showAddItemPriceDialog() {
        this.$bvModal.show('add-item-price-group');
      },
      reloadData() {
        this.fetchCustomItemPrices(this.$route.params.id);
      },
      fillEditData(data) {
        this.editedItemPriceGroup = data;
      },
    },
    computed: {
      ...mapGetters(['getCustomItemPrice', 'getUnit']),
    },
    watch: {
      form: {
        handler() {
          if (this.searchCountdownObject != 'null') {
            clearTimeout(this.searchCountdownObject);
          }

          const that = this;

          if (this.form.searchQuery != '') {
            this.searchCountdownObject = setTimeout(function () {
              that.queryCustomItemPrices({
                projectId: that.$route.params.id,
                queries: that.form,
              });
            }, 500);
          } else {
            this.fetchCustomItemPrices(this.$route.params.id);
          }
        },

        deep: true,
      },
    },
    components: {
      ItemPriceItem,
      FloatingActionButton,
      AddItemPriceGroup,
      EditItemPriceGroup,
    },
  };
</script>
