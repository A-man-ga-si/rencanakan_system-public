<template>
  <div
    class="
      item-price-card-single
      position-relative
      mb-3
      custom-nice-border
      p-4
      rounded-md
      shadow-sm
    "
  >
    <div class="heading">
      <h5>{{ index + 1 }}. {{ title }}</h5>
    </div>
    <div class="body">
      <table class="table text-left">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Uraian</th>
            <th scope="col">Satuan</th>
            <th scope="col">Kode</th>
            <th scope="col">Harga</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <ItemPriceItemRow
          v-for="(item, idx) in concatedItemPrice"
          :key="idx"
          :index="idx"
          :item="item"
          :units="units"
        />
        <tr>
          <td colspan="8" class="font-weight-bold">
            <a href="#" @click.prevent="addItemPrice" class="d-block w-100">
              + Tambah Baris
            </a>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import ItemPriceItemRow from '@/components/Project/Rab/ItemPriceItemRow.vue';

  export default {
    props: ['title', 'index', 'itemPriceGroup', 'units'],
    data() {
      return {
        mergedItemPrices: [],
      };
    },
    methods: {
      addItemPrice() {
        this.$bvModal.show('add-item-price-group');
      },
    },
    computed: {
      concatedItemPrice() {
        const customItemPrice = this.itemPriceGroup.custom_item_price || [];
        const itemPrice = this.itemPriceGroup.item_price || [];
        return itemPrice.concat(customItemPrice);
      },
    },
    watch: {
      itemPriceGroup() {
        this.mergedItemPrices = this.itemPriceGroup.custom_item_price.concat(
          this.itemPriceGroup.item_price
        );
      },
    },
    components: {
      ItemPriceItemRow,
    },
  };
</script>

<style scoped>
  .action-close {
    font-size: 17px;
  }

  .custom-nice-border {
    border: 2px solid #ddd;
  }

  td {
    vertical-align: middle;
  }
</style>
