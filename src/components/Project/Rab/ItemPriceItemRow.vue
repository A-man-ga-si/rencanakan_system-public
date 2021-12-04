<template>
  <tr>
    <td>{{ index + 1 }}</td>
    <td>
      <input
        v-if="isCustomItemPrice(item)"
        type="text"
        class="rab-inline-editor"
        style="width: 100%"
        v-model="form.name"
        @change="partialUpdate('name')"
      />
      <span v-else>{{ item.name }}</span>
    </td>
    <td>
      <v-select
        v-if="isCustomItemPrice(item)"
        label="name"
        class="rab-inline-editor"
        :reduce="unit => unit.hashid"
        v-model="form.unit.hashid"
        :options="units"
        @change="partialUpdate('unit_id')"
      />
      <span v-else>{{ item.unit.name }}</span>
    </td>
    <td>
      <input
        v-if="isCustomItemPrice(item)"
        type="text"
        class="rab-inline-editor"
        v-model="form.code"
        @change="partialUpdate('code')"
      />
      <span v-else>{{ item.id }}</span>
    </td>
    <td>
      <input
        type="text"
        class="rab-inline-editor"
        v-model="form.price"
        @change="partialUpdate('price')"
      />
    </td>
    <td>
      <div class="action-bt" v-if="isCustomItemPrice(item)">
        <DeleteButton @click.prevent="destroyCustomItemPrice" />
      </div>
    </td>
  </tr>
</template>

<script>
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  import { showConfirmAlert } from '@/utils';

  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
      units: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        unitId: this.isCustomItemPrice(this.item) ? this.item.unit.hashid : '',
        form: { ...this.item },
      };
    },
    methods: {
      ...mapActions(['deleteCustomItemPrice', 'customItemPricePartialUpdate']),
      async destroyCustomItemPrice() {
        if (this.isCustomItemPrice(this.item)) {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Konfirmasi',
            text: 'Hapus harga satuan ? semua item yang terhubung dengan harga satuan ini akan dihapus !',
          });
          if (isConfirmed) {
            await this.deleteCustomItemPrice({
              projectId: this.$route.params.id,
              customItemPriceCode: this.item.hashid,
            });
            this.$parent.$emit('custom-item-price-deleted');
            Notify.success('Harga Satuan Berhasil Dihapus !');
          }
        } else {
          console.log(
            "Nothing to do, this is not custom item price so you can't delete it"
          );
        }
      },
      async partialUpdate(updatedKey) {
        const { name, unit, code, price } = this.form;
        console.log(this.form);

        const data = await this.customItemPricePartialUpdate({
          projectId: this.$route.params.id,
          customItemPriceId: this.isCustomItemPrice(this.item)
            ? this.item.hashid
            : this.item.id,
          form: {
            name,
            unit_id: unit.hashid,
            code,
            price,
            model: this.isCustomItemPrice(this.item)
              ? 'CustomItemPrice'
              : 'ItemPrice',
          },
        });
      },
      isCustomItemPrice(itemPrice) {
        return !!itemPrice.project_id;
      },
    },
    components: {
      EditButton,
      DeleteButton,
    },
  };
</script>

<style scoped>
  .rab-inline-editor {
    border: none !important;
  }

  td {
    vertical-align: middle;
  }

  .inline-edit {
    border: none;
  }
</style>
