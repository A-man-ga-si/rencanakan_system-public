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
          label="name"
          :reduce="(priceGroup) => priceGroup.hashid"
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
        :label="'Nama'"
        field-name="name"
        v-model="form.name"
      />
      <div class="labeled-select position-relative mb-4">
        <span class="px-1"> Satuan</span>
        <v-select
          label="name"
          :reduce="(unit) => unit.hashid"
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
    props: ['selectedItemGroup', 'selectedItemPrice'],
    data() {
      return {
        form: {
          id: '',
          name: '',
          unit: '',
          itemPriceGroup: '',
        },
        modalId: 'edit-item-price',
      };
    },
    computed: {
      ...mapGetters(['getUnit', 'getPriceGroups']),
    },
    methods: {
      ...mapActions(['updateItemPrice']),
      async submit() {
        const request = {
          group_id: this.form.itemPriceGroup,
          id: this.form.id,
          name: this.form.name,
          unit_id: this.form.unit,
          price: this.form.price,
        };
        const response = await this.updateItemPrice({id: this.selectedItemPrice.id, request});
        Notify.success('Berhasil mengupdate data harga satuan');
        this.$emit('item-price-updated');
        this.hideModal(this.modalId);
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
    },
    components: {
      ValidationInput,
    },
    watch: {
      selectedItemPrice() {
        this.form = {
          ...this.selectedItemPrice,
          unit: this.selectedItemPrice.unit.hashid,
          itemPriceGroup: this.selectedItemGroup,
        };
      },
    },
  };
</script>
