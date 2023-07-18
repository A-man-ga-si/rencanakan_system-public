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
      <h5>{{ processAlphabeticNumber(idx + 1) }}. {{ item.name }}</h5>
    </div>
    <div class="body">
      <table class="table text-left table-responsive d-block d-sm-table w-100">
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
                @change="doUpdatePrice(item, $event)"
                type="text"
                class="rab-inline-editor"
                :value="item.price.length ? item.price[0].price : ''"
              />
            </td>
            <td>
              <EditButton @click.prevent="editItemPrice(item)" />
              <DeleteButton @click.prevent="destroyItemPrice(item)" />
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
  import { showConfirmAlert, convertNumberToAlphabet } from './../../../utils';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    // FIXME: Please move activeProvince system to state management !
    props: ['item', 'idx', 'activeProvince'],
    methods: {
      ...mapActions(['deleteItemPrice', 'updatePrice']),
      editItemPrice(item) {
        this.$emit('edit-item-clicked', item);
      },
      processAlphabeticNumber(num) {
        return convertNumberToAlphabet(num);
      },
      async destroyItemPrice(item) {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus Data Harga Satuan ?',
          text: 'Aksi ini tidak dapat dibatalkan !',
        });
        if (isConfirmed) {
          try {
            await this.deleteItemPrice(item.id);
            Notify.success('Berhasil menghapus data harga satuan');
            this.$emit('item-deleted');
          } catch (err) {
            if (err.response) {
              Notify.failure(err.response.data.message);
            } else {
              Notify.failure('Gagal saat mencoba menghapus harga satuan');
            }
          }
        }
      },
      async doUpdatePrice(item, ref) {
        await this.updatePrice({
          id: item.id,
          form: {
            province_id: this.activeProvince,
            price: ref.target.value,
          },
        });
      },
    },
    components: {
      EditButton,
      DeleteButton,
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

  td {
    vertical-align: middle;
  }

  .rab-inline-editor {
    width: 100%;
    border: none !important;
  }
</style>
