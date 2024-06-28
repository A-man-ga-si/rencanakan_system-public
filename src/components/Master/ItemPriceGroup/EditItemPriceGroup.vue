<template>
  <div class="edit-item-price-group">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.item-price-group.update-item-price-group')"
    >
      <ValidationInput
        :label="'Name'"
        field-name="name"
        @keydown.enter="submit"
        v-model="form.name"
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
  import validationMixin from './../../../mixins/validation-mixins';
  import ValidationInput from './../../Common/ValidationInput.vue';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixin],
    props: ['selectedItemPriceGroup'],
    data() {
      return {
        form: {
          name: '',
        },
        modalId: 'edit-item-price-group',
      };
    },
    methods: {
      ...mapActions(['updateItemPriceGroup']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      async submit() {
        try {
          this.resetInvalid();
          await this.updateItemPriceGroup({
            id: this.selectedItemPriceGroup.hashid,
            data: {
              name: this.form.name,
            },
          });
          Notify.success('Berhasil mengupdate kelompok harga satuan');
          this.$emit('item-price-group-updated');
          this.resetForm();
          this.hideModal(this.modalId);
        } catch (err) {
          if (err.response?.status == 400 ){
            Notify.failure(err.response.data.message);
            return;
          }
          this.checkForInvalidResponse(err);
        }
      },
      resetForm() {
        for (const formIdx in this.form) {
          this.form[formIdx] = '';
        }
      },
    },
    watch: {
      selectedItemPriceGroup(ctx) {
        this.form.name = this.selectedItemPriceGroup.name;
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
