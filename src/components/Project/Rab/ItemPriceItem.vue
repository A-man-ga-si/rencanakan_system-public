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
          </tr>
        </thead>
        <tr
          v-for="(item, idx) in itemPriceGroup.custom_item_price.concat(
            itemPriceGroup.item_price
          )"
          :key="idx"
        >
          <td>{{ idx + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.unit.name }}</td>
          <td>{{ item.project_id ? item.code : item.id }}</td>
          <td>
            <input type="text" class="rab-inline-editor" :value="item.price" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        mergedItemPrices: [],
      };
    },
    props: ['title', 'index', 'itemPriceGroup'],
    watch: {
      itemPriceGroup() {
        this.mergedItemPrices = this.itemPriceGroup.custom_item_price.concat(
          this.itemPriceGroup.item_price
        );
        console.log(this.itemPriceGroup);
      },
    },
  };
</script>

<style scoped>
  .inline-edit {
    border: none;
  }

  .action-close {
    font-size: 17px;
  }

  .custom-nice-border {
    border: 2px solid #ddd;
  }

  td {
    vertical-align: middle;
  }

  .rab-inline-editor {
    /* width: 100%; */
    border: none !important;
  }
</style>
