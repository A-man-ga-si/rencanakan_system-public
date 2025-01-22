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
      <div style="width: 350px">
        <rcn-ahsproject-dropdown
          :is-disabled="isAhsUpdating"
          :ahs-group-items="ahsGroupItems"
          :ahs-items="ahsItems"
          :selected-ahs="selectedCustomAhs"
          :selected-group-key="selectedAhsGroupKey"
          :search-query="ahsSearchQuery"
          @on-show-popup="() => $emit('did-ahs-dropdown-showed')"
          @on-dismiss="() => $emit('did-ahs-dropdown-dismissed')"
          @on-change-search-input="
            (data) => $emit('did-search-input-changed', data)
          "
          @on-change-ahs-group="(data) => $emit('did-ahs-group-changed', data)"
          @on-click-reset-button="didResetButtonClicked"
          :on-select="didAhsItemSelected"
        />
      </div>
    </td>
    <td>
      <NumericInput
        class="inline-edit"
        v-model="form.volume"
        :onChangeValue="didVolumeChanged"
      />
    </td>
    <td>
      <v-select
        v-model="form.unitId"
        label="name"
        :reduce="(unit) => unit.hashid"
        :options="unitIds"
        @input="onSelectUnit"
      />
    </td>
    <td>
      <NumericInput
        class="inline-edit"
        v-model="form.price"
        :disabled="selectedCustomAhs != null"
        :isSeparatorEnabled="false"
        :onChangeValue="didPriceChanged"
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
  import { NumericInput, RcnAhsprojectDropdown } from '@/components/Common';

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
      ahsItems: {
        type: Array,
      },
      unitIds: {
        type: Array,
      },
      selectedAhsGroupKey: {
        type: String,
        default: null,
      },
      ahsSearchQuery: {
        type: String,
        default: '',
      },
    },
    mounted() {},
    methods: {
      ...mapActions(['destroyRabItem', 'updateRabItem', 'updateRabItemAhs']),
      onChangeNameInput(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          const mutatedRabItem = this.rabItemData;
          mutatedRabItem.name = event.target.value;
          this.$emit('did-rab-item-updated', mutatedRabItem);
        }, 500);
      },
      didVolumeChanged() {
        const mutatedRabItem = this.rabItemData;
        mutatedRabItem.volume = this.form.volume;
        this.$emit('did-rab-item-updated', mutatedRabItem);
      },
      didPriceChanged() {
        const mutatedRabItem = this.rabItemData;
        mutatedRabItem.price = this.form.price;
        this.$emit('did-rab-item-updated', mutatedRabItem);
      },
      onSelectUnit(value) {
        const mutatedRabItem = this.rabItemData;
        mutatedRabItem.hashed_unit_id = value;
        this.$emit('did-rab-item-updated', mutatedRabItem);
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
        // Setup name form value
        this.form.name = this.rabItemData?.name;

        // Setup volume form value
        this.form.volume =
          this.rabItemData?.volume !== null && this.rabItemData.volume !== 0
            ? parseFloat(this.rabItemData?.volume ?? 0)
            : undefined;

        // Setup unit form value
        this.form.unitId = this.rabItemData?.hashed_unit_id;

        // Setup price form value
        if (this.rabItemData.custom_ahs != null) {
          this.form.price = parseInt(this.rabItemData.custom_ahs.price);
          return;
        }
        this.form.price =
          this.rabItemData.price !== null && this.rabItemData.price !== 0
            ? parseFloat(this.rabItemData.price ?? 0)
            : undefined;
      },
      didAhsGroupChanged(groupKey) {
        this.didAhsGroupSelected(groupKey);
      },
      didResetButtonClicked() {
        this.$emit('did-reset-ahs-button-clicked', {
          rabRowItemId: this.rabItemData.hashid,
        });
      },
      async didAhsItemSelected(groupKey, ahsItem) {
        this.$emit('did-ahs-code-updated', {
          rabRowItemId: this.rabItemData.hashid,
          ahsId: ahsItem.key,
        });
      },
      setupSelectedCustomAhs() {
        if (this.rabItemData?.custom_ahs == null) {
          this.selectedCustomAhs = null;
          return;
        }
        this.selectedCustomAhs = {
          label: `${this.rabItemData?.custom_ahs.code} - ${this.rabItemData?.custom_ahs.name}`,
        };
      },
    },
    computed: {
      getSubtotalPrice() {
        const rabItemPrice =
          this.rabItemData.custom_ahs != null
            ? this.rabItemData.custom_ahs.price
            : this.rabItemData.price ?? 0;
        const trimmedPrice = String(rabItemPrice)
          .trim()
          .replaceAll('Rp', '')
          .replaceAll(',', '')
          .replaceAll('.', '');
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
        },
      },
    },
    components: {
      NumericInput,
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
