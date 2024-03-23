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
        label="id"
        @input="update"
        :clearable="true"
        :reduce="ahsIds => ahsIds.id"
        :options="combinedAhsIds"
        v-model="form.ahsId"
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
        <ph-x weight="light" :size="16" />
      </a>
    </td>
  </tr>
</template>

<script>
  import { showConfirmAlert } from '@/utils';
  import { mapActions } from 'vuex';
  import { PhX } from 'phosphor-vue';
  import { formatCurrency } from '@/utils';
  export default {
    data() {
      return {
        form: {
          name: '',
          ahsId: '',
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
      ahsIds: {
        type: Array,
      },
      unitIds: {
        type: Array,
      },
    },
    mounted() {},
    methods: {
      ...mapActions(['destroyMasterRabItem', 'updateMasterRabItem']),
      async update() {
        if (!this.form.unitId) {
          this.form.unitId = this.unitIds[0].hashid
        }
        const { name, ahsId, volume, unitId, price } = this.form;
        await this.updateMasterRabItem({
          rabId: this.rab.hashid,
          rabItemId: this.rabItemData.hashid,
          form: {
            name,
            ahs_id: ahsId,
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
          await this.destroyMasterRabItem({
            projectId: this.$route.params.id,
            rabItemId: this.rabItemData.hashid,
            rabId: this.rab.hashid,
          });
          this.$emit('rab-item-deleted');
        }
      },
      isAhsReferenced(data) {
        return !!data?.ahs_id;
      },
    },
    computed: {
      combinedAhsIds() {
        const combinedCustomAhs = [
          {
            hashid: '',
            name: '-',
            id: '-',
          },
        ].concat(this.ahsIds || []);
        console.log(this.ahsIds)
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
    components: {
      PhX,
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
