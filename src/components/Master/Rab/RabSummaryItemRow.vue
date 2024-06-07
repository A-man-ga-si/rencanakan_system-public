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
        @input="update"
        :clearable="true"
        :options="customAhsItems"
        v-model="form.selectedCustomAhs"
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
        customAhsItems: [],
        form: {
          name: '',
          selectedCustomAhs: null,
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
        const { name, selectedCustomAhs, volume, unitId, price } = this.form;
        const trimmedPrice = price
          .replace("Rp.", "")
          .replace(",", "")
          .replace(" ", "");
        await this.updateMasterRabItem({
          rabId: this.rab.hashid,
          rabItemId: this.rabItemData.hashid,
          form: {
            name,
            ahs_id: selectedCustomAhs.id,
            volume,
            unit_id: unitId,
            price: trimmedPrice,
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
      jumlahSubtotal() {
        return `Rp. ${formatCurrency((this.rabItemData.price ?? 0) * this.rabItemData.volume)}`;
      },
    },
    watch: {
      $props: {
        immediate: true, 
        handler () {
          this.form.name = this.rabItemData?.name;
          this.customAhsItems = [
            { id: '', label: '-' },
            ...this.ahsIds.map(customAhs => {
              return {
                id: customAhs.id,
                label: `${customAhs.name} - ${customAhs.id}`
              }
            })
          ];
          this.form.selectedCustomAhs = this.customAhsItems.find(
            ahsItem => ahsItem.id == (this.rabItemData?.ahs_id ?? "")
          );
          this.form.volume = this.rabItemData?.volume;
          this.form.unitId = this.rabItemData?.hashed_unit_id;
          this.form.price = `Rp. ${formatCurrency((this.rabItemData.price ?? 0).toFixed(2))}`;
        }
      }
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
