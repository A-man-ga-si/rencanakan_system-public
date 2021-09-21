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
      <h5>I. UPAH TENAGA KERJA</h5>
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
          <tr>
            <td>1.</td>
            <td>Pekerja</td>
            <td>OH</td>
            <td>L.01</td>
            <td>180,000</td>
            <td>
              <EditButton @click.prevent="editItemPrice(id)" />
              <DeleteButton @click.prevent="deleteItemPrice(id)" />
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
    methods: {
      editItemPrice() {
        this.$bvModal.show('edit-item-price');
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
</style>
