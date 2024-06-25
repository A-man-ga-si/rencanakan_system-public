<template>
  <tr>
    <td>{{ index + 1 }}.</td>
    <td>
      <span>{{ rabItemData.custom_ahs_itemable_type == 'App\\Models\\CustomItemPrice' ? rabItemData.custom_ahs_itemable.name : rabItemData.custom_ahs_itemable.name  }}</span>
    </td>
    <td>
      <span>{{ rabItemData.rab_item_without_ahs ? '1' : rabItemData.coefficient }}</span>
    </td>
    <td>
      <span>{{ rab.volume }}</span>
    </td>
    <td>
      <span>Rp. {{ formatUnitPrice }}</span>
    </td>
    <td>
      <span>{{ unitName }}</span>
    </td>
    <td>
      <span>{{ (rabItemData.rab_item_without_ahs ? (rab.volume || 0) * 1 : (rabItemData.coefficient || 0) * (rab.volume || 0)) }}</span>
    </td>
    <td>
      <span>Rp. {{ formatTotalPrice }}
      </span>
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
    mounted() {
    },
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
      formatUnitPrice() {
        return formatCurrency(this.rabItemData.custom_ahs_itemable_type == 'App\\Models\\CustomItemPrice' ?
         this.rabItemData.custom_ahs_itemable.price : 
          (this.rabItemData.custom_ahs_itemable_type == 'App\\Models\\CustomAhp' ?
           this.rabItemData.custom_ahs_itemable.subtotal : this.rabItemData.custom_ahs_itemable.price))
      },
      formatTotalPrice() {
        return formatCurrency(this.rabItemData.subtotal)
      },
      unitName() {
        if (this.unitIds) {
          for (const unitId of this.unitIds) {
            if ((unitId.id == this.rabItemData.unit_id) || (unitId.hashid == this.rabItemData.unit_id)) {
              return unitId.name
            }
          }
        }
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
