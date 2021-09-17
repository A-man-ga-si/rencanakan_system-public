<template>
  <div class="add-unit">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.item-price-group.add-item-price-group')"
    >
      <ValidationInput
        :label="'Name'"
        field-name="name"
        @keydown.enter="submit"
        v-model="form.unitName"
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
  import ValidationInput from './../../Common/ValidationInput.vue';
  import validationMixins from './../../../mixins/validation-mixins';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixins],
    data: () => ({
      modalId: 'add-item-price-group',
      form: {
        unitName: '',
      },
    }),
    methods: {
      ...mapActions(['storeItemPriceGroup']),
      async submit() {
        try {
          this.resetInvalid();
          await this.storeItemPriceGroup({
            name: this.form.unitName,
          });
          this.resetForm();
          this.hideModal(this.modalId);
          Notify.success('Berhasil menambahkan data kelompok harga satuan');
          this.$emit('item-price-group-added');
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      resetForm() {
        this.form = {
          unitName: '',
        };
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
