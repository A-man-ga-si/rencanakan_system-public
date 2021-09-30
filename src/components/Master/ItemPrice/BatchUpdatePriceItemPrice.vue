<template>
  <div class="batch-update-price-item-price">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="'Batch Update Harga Satuan'"
      no-close-on-backdrop
      lazy
    >
      <div class="labeled-select position-relative mb-4">
        <span class="px-1"> Harga Satuan</span>
        <v-select
          label="name"
          :reduce="itemPrice => itemPrice.id"
          :options="itemPrices"
          id=""
          v-model="itemPriceId"
        />
      </div>
      <ValidationInput
        class="mb-4"
        type="number"
        :label="'Harga'"
        field-name="price"
        v-model="form.price"
      />
      <template slot="modal-footer">
        <b-button
          @click.prevent="submitBatchUpdate"
          variant="primary"
          class="mr-1"
        >
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
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  import { showConfirmAlert } from './../../../utils';

  export default {
    data: () => ({
      itemPriceId: '',
      form: {
        price: '',
      },
      modalId: 'batch-update-price-modal',
    }),
    mixins: [validationMixin],
    props: ['itemPrices'],
    methods: {
      ...mapActions(['batchUpdateItemPrice']),
      async submitBatchUpdate() {
        try {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Gantikan Semua Harga ?',
            text: 'Ketika anda melakukan batch update, maka semua harga pada harga satuan akan tergantikan dengan harga yang baru',
          });
          if (isConfirmed) {
            const data = await this.batchUpdateItemPrice({
              itemPriceId: this.itemPriceId,
              form: this.form,
            });
            Notify.success('Berhasil batch update harga satuan');
            this.hideModal(this.modalId);
            this.$emit('item-price-batch-updated');
          }
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
      resetForm() {
        this.form = {};
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
    },
    watch: {
      itemPrices() {
        if (this.itemPrices.length) {
          this.itemPriceId = this.itemPrices[0].id;
        }
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
