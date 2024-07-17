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
        @input="onChangeAhsCode"
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
        :disabled="getIsPriceInputDisabled"
      />
    </td>
    <td>{{ getSubtotalPrice }}</td>
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
      onChangeAhsCode() {
          if(this.form.selectedCustomAhs.id == '') {
            this.form.price = null;
            return
          }
          this.form.price = this.form.selectedCustomAhs.price;
          this.update();
      },
      async update() {
        const { name, selectedCustomAhs, volume, unitId, price } = this.form;
        await this.updateRabItem({
          projectId: this.$route.params.id,
          rabId: this.rab.hashid,
          rabItemId: this.rabItemData.hashid,
          form: {
            name,
            custom_ahs_id: selectedCustomAhs.id,
            volume,
            unit_id: unitId,
            price: price,
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
      setupSelectedAhs(data) {
        return !!data?.custom_ahs_id;
      },
      setupFormValues() {
        this.form.name = this.rabItemData?.name;
        this.customAhsItems = [
          { id: '', label: '-' },
          ...this.customAhsIds.map(customAhs => {
            return {
              id: customAhs.hashid,
              label: `${customAhs.name} - ${customAhs.code}`,
              price: customAhs.price
            }
          })
        ];
        this.form.selectedCustomAhs = !this.rabItemData?.custom_ahs
          ? this.customAhsItems[0]
          : this.customAhsItems.find(
            customAhsItem => customAhsItem.id == this.rabItemData?.custom_ahs.hashid
          );
        this.form.volume = this.rabItemData?.volume;
        this.form.unitId = this.rabItemData?.hashed_unit_id;
        const rabItemPrice = this.rabItemData?.custom_ahs
          ? this.rabItemData?.custom_ahs.price.toFixed(2)
          : this.rabItemData.price;
        this.form.price = this.form.selectedCustomAhs.id != "" 
            ? `Rp. ${formatCurrency(parseInt(rabItemPrice).toFixed(2))}`
            : rabItemPrice ?? 0;
      }
    },
    computed: {
      getIsPriceInputDisabled() {
        if (this.form.selectedCustomAhs == null) {
          return false;
        }
        return this.form.selectedCustomAhs.id != "";
      },
      getSubtotalPrice() {
        const trimmedPrice = String(this.form.price ?? 0)
          .trim()
          .replaceAll('Rp','')
          .replaceAll(',','')
          .replaceAll('.','');
        const subtotalPrice = trimmedPrice * (this.form.volume ?? 0);
        return `Rp. ${formatCurrency(subtotalPrice)}`;
      },
    },
    created() {
      this.setupFormValues();
    },
    watch: {
      rabItemData() {
        this.setupFormValues();
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
