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
    <div class="heading d-flex justify-content-between">
      <div class="left">
        <h5>{{ index + 1 }}. {{ title }}</h5>
      </div>
      <div v-if="!itemPriceGroup.is_default" class="right">
        <a class="h4 ml-1" href="#" @click.prevent="updateCustomItemPrice">
          <ph-pencil weight="light" :size="25" />
        </a>
        <a class="h4 ml-1" href="#" @click.prevent="deleteCustomItemPriceGroup">
          <ph-x weight="light" :size="25" />
        </a>
      </div>
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
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';
  import { showConfirmAlert } from '@/utils';
  import { PhX, PhPencil, PhArrowsIn } from 'phosphor-vue';

  export default {
    props: ['title', 'index', 'itemPriceGroup', 'units'],
    data() {
      return {
        mergedItemPrices: [],
      };
    },
    methods: {
      ...mapActions(['destroyCustomItemPriceGroup', 'storeCustomItemPrice']),
      async addItemPrice() {
        try {
          await this.storeCustomItemPrice({
            projectId: this.$route.params.id,
            form: {
              custom_item_price_group_id: this.itemPriceGroup.hashid,
              project_id: this.$route.params.id,
            },
          });
          this.$emit('custom-item-price-added');
        } catch (err) {
          Notify.failure('Gagal menambahkan harga satuan');
        }
      },
      async deleteCustomItemPriceGroup() {
        try {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Hapus Kategori Harga Satuan ?',
            text: 'Jika anda menghapus kategori ini, maka semua harga satuan di dalam list akan terhapus permanent !',
          });
          if (isConfirmed) {
            await this.destroyCustomItemPriceGroup({
              projectId: this.$route.params.id,
              customItemPriceGroupId: this.itemPriceGroup.hashid,
            });
            Notify.success('Berhasil menghapus kategori harga satuan');
            this.$emit('custom-item-price-group-deleted');
          }
        } catch (err) {
          Notify.failure(
            `Gagal menghapus kategori harga satuan : ${err.response.data.message}`
          );
        }
      },
      updateCustomItemPrice() {
        try {
          this.$bvModal.show('edit-item-price-group');
          this.$emit(
            'edit-bt-custom-item-price-group-clicked',
            this.itemPriceGroup
          );
        } catch (err) {
          console.error(err);
        }
      },
    },
    computed: {
      ...mapGetters(['getUnit']),
      concatedItemPrice() {
        const customItemPrice = this.itemPriceGroup.custom_item_price || [];
        const itemPrice = this.itemPriceGroup.item_price || [];

        if (itemPrice.length) {
          customItemPrice.forEach((cip, idx) => {
            for (const ip of itemPrice) {
              console.log(cip);
              if (ip.id == cip.code) {
                ip.price = cip.price;
                customItemPrice.splice(idx, 1);
                // delete customItemPrice[idx];
              }
            }
          });
        }

        const concatedItemPrices = itemPrice.concat(customItemPrice);

        return concatedItemPrices;
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
      PhX,
      PhPencil,
      PhArrowsIn,
    },
  };
</script>

<style scoped>
  .action-close {
    font-size: 17px;
  }

  td {
    vertical-align: middle;
  }
</style>
