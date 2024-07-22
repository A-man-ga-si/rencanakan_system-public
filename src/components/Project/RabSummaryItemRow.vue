<template>
  <tr>
    <td>{{ index + 1 }}.</td>
    <td>
      <input
        type="text"
        class="inline-edit w-100"
        placeholder="Isi nama pekerjaan"
        v-model="form.name"
        @change="onChangeNameInput"
      />
    </td>
    <td>
      <rcn-ahsproject-dropdown
        :is-disabled="isAhsUpdating"
        :ahs-group-items="ahsGroupItems"
        :selected-ahs="selectedCustomAhs"
        :selected-group-key="selectedAhsGroupKey"
        :search-query="ahsSearchQuery"
        @on-dismiss="() => $emit('did-ahs-dropdown-dismissed')"
        @on-change-search-input="(data) => $emit('did-search-input-changed', data)"
        @on-change-ahs-group="(data) => $emit('did-ahs-group-changed', data)"
        :on-select="didAhsItemSelected"
      />
    </td>
    <td>
      <input
        type="text"
        class="inline-edit w-100"
        v-model="form.volume"
        @change="onChangeVolumeInput"
      />
    </td>
    <td>
      <v-select
        v-model="form.unitId"
        label="name"
        :reduce="unit => unit.hashid"
        :options="unitIds"
        @input="onSelectUnit"
      />
    </td>
    <td>
      <input
        @change="update"
        type="text"
        class="inline-edit"
        placeholder="Isi harga satuan"
        v-model="form.price"
        :disabled="this.selectedCustomAhs != null"
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
  import { RcnAhsprojectDropdown } from '@/components/Common'

  export default {
    data() {
      return {
        customAhsItems: [],
        isAhsUpdating: false,
        nameDebouncerTimeout: null,
        selectedCustomAhs: null,
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
      ahsGroupItems: {
        type: Array,
      },
      unitIds: {
        type: Array,
      },
      selectedAhsGroupKey: {
        type: String,
        default: null
      },
      ahsSearchQuery: {
        type: String,
        default: ''
      }
    },
    mounted() {},
    methods: {
      ...mapActions(['destroyRabItem', 'updateRabItem', 'updateRabItemAhs']),
      onChangeNameInput(event) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          const mutatedRabItem = this.rabItemData;
          mutatedRabItem.name = event.target.value;
          this.$emit('did-rab-item-updated', mutatedRabItem);
        }, 500);
      },
      onChangeVolumeInput(event) {
        const mutatedRabItem = this.rabItemData;
        mutatedRabItem.volume = event.target.value;
        this.$emit('did-rab-item-updated', mutatedRabItem);
      },
      onSelectUnit(value) {
        const mutatedRabItem = this.rabItemData;
        mutatedRabItem.hashed_unit_id = value;
        this.$emit('did-rab-item-updated', mutatedRabItem);
      },
      async update() {
        const { name, selectedCustomAhs, volume, unitId, price } = this.form;
        const trimmedPrice = String(this.form.price ?? 0)
          .trim()
          .replaceAll('Rp','')
          .replaceAll(',','')
          .replaceAll('.','');
        await this.updateRabItem({
          projectId: this.$route.params.id,
          rabId: this.rab.hashid,
          rabItemId: this.rabItemData.hashid,
          form: {
            name,
            custom_ahs_id: selectedCustomAhs.id,
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
        this.form.volume = this.rabItemData?.volume;
        this.form.unitId = this.rabItemData?.hashed_unit_id;
        this.form.price = this.rabItemData.custom_ahs != null
            ? `Rp. ${formatCurrency(parseInt(this.rabItemData.custom_ahs.price).toFixed(2))}`
            : this.rabItemData.price ?? 0;
      },
      didAhsGroupChanged(groupKey) {
        this.didAhsGroupSelected(groupKey);
      },
      async didAhsItemSelected(groupKey, ahsItem)  {
        this.$emit('did-ahs-code-updated',{
            rabRowItemId: this.rabItemData.hashid,
            ahsId: ahsItem.key,
        });
      },
      setupSelectedCustomAhs() {
        this.selectedCustomAhs = {
          'label': `${this.rabItemData?.custom_ahs.code} - ${this.rabItemData?.custom_ahs.name}`
        }
      }
    },
    computed: {
      getSubtotalPrice() {
        const rabItemPrice = this.rabItemData.custom_ahs != null 
          ? this.rabItemData.custom_ahs.price
          : this.rabItemData.price;
        const trimmedPrice = String(rabItemPrice)
          .trim()
          .replaceAll('Rp','')
          .replaceAll(',','')
          .replaceAll('.','');
        const subtotalPrice = trimmedPrice * (this.rabItemData.volume ?? 0);
        return `Rp. ${formatCurrency(subtotalPrice)}`;
      },
    },
    created() {
      this.setupFormValues();
      this.setupSelectedCustomAhs();
    },
    watch: {
      rabItemData: {
        deep: true,
        handler(newValue, _) {
          this.setupFormValues();
          this.setupSelectedCustomAhs();
        }
      }
    },
    components: {
      RcnAhsprojectDropdown,
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
