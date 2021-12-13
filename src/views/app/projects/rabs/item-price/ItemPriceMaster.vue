<template>
  <div>
    <b-row class="">
      <b-col :lg="6" :xl="3">
        <div class="text-right mb-2 position-relative">
          <label class="form-group has-float-label mb-0">
            <input type="text" class="form-control" />
            <span> Search Item </span>
          </label>
          <i
            class="simple-icon-magnifier position-absolute bg-white"
            style="top: 11px; right: 10px"
          />
        </div>
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
  import ItemPriceItem from '../../../../../components/Project/Rab/ItemPriceItem.vue';
  import FloatingActionButton from '@/components/Project/FloatingActionButton.vue';
  import AddItemPriceGroup from '@/components/Project/Rab/AddItemPriceGroup.vue';
  import EditItemPriceGroup from '@/components/Project/Rab/EditItemPriceGroup.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        editedItemPriceGroup: {},
      };
    },
    created() {
      this.fetchCustomItemPrices(this.$route.params.id);
      this.fetchUnit();
    },
    methods: {
      ...mapActions(['fetchCustomItemPrices', 'fetchUnit']),
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
    components: {
      ItemPriceItem,
      FloatingActionButton,
      AddItemPriceGroup,
      EditItemPriceGroup,
    },
  };
</script>
