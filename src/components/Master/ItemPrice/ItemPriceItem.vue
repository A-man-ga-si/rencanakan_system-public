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
    <div class="heading mb-3">
      <h5>{{ idx + 1 }}. {{ item.name }}</h5>
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
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in item.item_price" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.unit.name }}</td>
            <td>{{ item.id }}</td>
            <td>
              <input
                type="text"
                class="rab-inline-editor"
                :value="item.price.length ? item.price[0].price : ''"
              />
            </td>
            <td>
              <EditButton @click.prevent="editItemPrice(item)" />
              <DeleteButton @click.prevent="deleteItemPrice(item)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';
  import { showConfirmAlert } from './../../../utils';

  export default {
    components: {
      EditButton,
      DeleteButton,
    },
    props: ['item', 'idx'],
    methods: {
      editItemPrice(item) {
        this.$emit('edit-item-clicked', item);
      },
      async deleteItemPrice() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus Data Harga Satuan ?',
          text: 'Aksi ini tidak dapat dibatalkan !',
        });
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
    width: 100%;
    border: none !important;
  }
</style>
