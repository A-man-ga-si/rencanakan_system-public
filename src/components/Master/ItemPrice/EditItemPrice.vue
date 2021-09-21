<template>
  <div class="edit-item-price">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.item-price.update-item-price')"
    >
      <div class="labeled-select position-relative mb-4">
        <span class="px-1"> Kelompok</span>
        <v-select
          name=""
          :options="masterData.itemPriceGroup"
          id=""
          v-model="form.itemPriceGroup"
        />
      </div>
      <ValidationInput
        class="mb-4"
        :label="'Kode'"
        field-name="id"
        v-model="form.id"
      />
      <ValidationInput
        class="mb-4"
        :label="'Name'"
        field-name="name"
        v-model="form.name"
      />
      <div class="labeled-select position-relative mb-4">
        <span class="px-1"> Satuan</span>
        <v-select
          name=""
          :options="masterData.unit"
          id=""
          v-model="form.unit"
        />
      </div>
      <template slot="modal-footer">
        <b-button @click.prevent="submit" variant="primary" class="mr-1">
          {{ $t('modal.save-bt') }}
        </b-button>
        <b-button variant="secondary" @click="hideModal(modalId)">
          {{ $t('modal.cancel-bt') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixin from '@/mixins/validation-mixins';

  export default {
    mixins: [validationMixin],
    props: ['selectedItemPrice'],
    data() {
      return {
        form: {
          id: '',
          name: '',
          unit: '',
          itemPriceGroup: '',
        },
        masterData: {
          unit: ['OH', 'cm3'],
          itemPriceGroup: ['Item Price 1', 'Item Price 2'],
        },
        modalId: 'edit-item-price',
      };
    },
    methods: {
      async submit() {},
      hideModal(refname) {
        this.$refs[refname].hide();
      },
    },
    components: {
      ValidationInput,
    },
    watch: {
      selectedItemPrice() {
        const { id, name, unit, item_price_group_id } = this.selectedItemPrice;
        this.form = {
          id,
          name,
          unit: unit.hashid,
          itempriceGroup: item_price_group_id,
        };
      },
    },
  };
</script>
