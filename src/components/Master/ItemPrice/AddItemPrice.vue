<template>
  <div class="add-item-price">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.item-price.add-item-price')"
      no-close-on-backdrop
    >
      <div class="labeled-select position-relative mb-4">
        <span class="px-1"> Kelompok</span>
        <v-select
          label="name"
          :reduce="itemPrice => itemPrice.hashid"
          :options="getPriceGroups"
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
          label="name"
          :reduce="unit => unit.hashid"
          :options="getUnit"
          id=""
          v-model="form.unit"
        />
      </div>
      <ValidationInput
        :label="'Harga'"
        field-name="price"
        v-model="form.price"
      />
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
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixin],
    data: () => ({
      form: {
        id: '',
        name: '',
        unit: '',
        price: undefined,
        itemPriceGroup: [],
      },
      modalId: 'add-item-price',
    }),
    created() {
      this.fetchUnit();
      this.fetchItemPriceGroup();
    },
    methods: {
      ...mapActions(['fetchItemPriceGroup', 'fetchUnit', 'storeItemPrice']),
      async submit() {
        const request = {
          id: this.form.id,
          name: this.form.name,
          unit_id: this.form.unit,
          item_price_group_id: this.form.itemPriceGroup,
          price: this.form.price
        };
        const data = await this.storeItemPrice(request);
        this.$emit('item-price-added', data);
        this.hideModal(this.modalId);
        this.resetForm();
        Notify.success('Berhasil menambahkan data harga satuan');
      },
      resetForm() {
        this.form = {
          id: '',
          name: '',
          unit: '',
          price: undefined,
          itemPriceGroup: [],
        };
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
    },
    computed: {
      ...mapGetters(['getUnit', 'getPriceGroups']),
    },
    components: {
      ValidationInput,
    },
  };
</script>
