<template>
  <tr>
    <td>{{ index + 1 }}.</td>
    <td>
      <input
        type="text"
        class="inline-edit w-100"
        placeholder="Isi nama pekerjaan"
        v-model="form.name"
        @change="update"
      />
    </td>
    <td>
      <v-select
        label="code"
        @input="update"
        :clearable="true"
        :reduce="customAhsIds => customAhsIds.hashid"
        :options="combinedCustomAhsIds"
        v-model="form.customAhsId"
      />
    </td>
    <td>
      <input
        type="text"
        class="inline-edit w-100"
        v-model="form.volume"
        @change="update"
      />
    </td>
    <td>
      <v-select
        v-model="form.unitId"
        label="name"
        @input="update"
        :reduce="unit => unit.hashid"
        :options="unitIds"
      />
    </td>
    <td>
      <input
        @change="update"
        type="text"
        class="inline-edit"
        placeholder="Isi harga satuan"
        v-model="form.price"
        :disabled="isAhsReferenced(rabItemData)"
      />
    </td>
    <td>{{ jumlahSubtotal }}</td>
    <td>
      <a
        href="#"
        class="text-danger action-close"
        @click.prevent="deleteAhsItem"
      >
        <i class="iconminds simple-icon-close"></i>
      </a>
    </td>
  </tr>
</template>

<script>
  import { showConfirmAlert } from '@/utils';
  import { mapActions } from 'vuex';
  import { formatCurrency } from '../../utils';
  export default {
    data() {
      return {
        form: {
          name: '',
          customAhsId: '',
          volume: '',
          unitId: '',
          price: '',
        },
      };
    },
    props: {
      rabItemData: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
      rab: {
        type: Object,
      },
      customAhsIds: {
        type: Array,
      },
      unitIds: {
        type: Array,
      },
    },
    mounted() {},
    methods: {
      ...mapActions(['destroyRabItem', 'updateRabItem']),
      async update() {
        const { name, customAhsId, volume, unitId, price } = this.form;
        await this.updateRabItem({
          projectId: this.$route.params.id,
          rabId: this.rab.hashid,
          rabItemId: this.rabItemData.hashid,
          form: {
            name,
            custom_ahs_id: customAhsId,
            volume,
            unit_id: unitId,
            price,
          },
        });
        this.$emit('update-rab-item');
      },
      async deleteAhsItem() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus item RAB ?',
          text: 'Item ini akan dihapus secara permanent !',
        });
        if (isConfirmed) {
          await this.destroyRabItem({
            projectId: this.$route.params.id,
            rabItemId: this.rabItemData.hashid,
            rabId: this.rab.hashid,
          });
          this.$emit('rab-item-deleted');
        }
      },
      isAhsReferenced(data) {
        return !!data?.custom_ahs_id;
      },
    },
    computed: {
      combinedCustomAhsIds() {
        const combinedCustomAhs = [
          {
            hashid: '',
            name: '-',
            code: '-',
          },
        ].concat(this.customAhsIds || []);
        return combinedCustomAhs;
      },
      jumlahSubtotal() {
        return `Rp. ${formatCurrency(
          this.isAhsReferenced(this.rabItemData)
            ? this.rabItemData.custom_ahs?.price * this.rabItemData.volume
            : this.rabItemData.price * this.rabItemData.volume
        )}`;
      },
    },
    watch: {
      $props: {
        handler() {
          this.form.name = this.rabItemData?.name;
          this.form.customAhsId = this.rabItemData?.custom_ahs
            ? this.rabItemData?.custom_ahs.hashid
            : '';
          this.form.volume = this.rabItemData?.volume;
          this.form.unitId = this.rabItemData?.hashed_unit_id;
          this.form.price = this.rabItemData?.custom_ahs
            ? this.rabItemData?.custom_ahs.price.toFixed(2)
            : this.rabItemData.price;
        },
        deep: true,
      },
    },
  };
</script>

<style scoped>
  .inline-edit {
    border: none;
    background-color: transparent;
  }

  td {
    vertical-align: middle;
  }
</style>
