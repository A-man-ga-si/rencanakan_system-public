<template>
  <div class="add-unit">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.unit.add-unit-bt')"
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
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  import validationMixin from './../../../mixins/validation-mixins';
  import ValidationInput from './../../Common/ValidationInput.vue';

  export default {
    mixins: [validationMixin],
    data: () => ({
      form: {
        unitName: '',
      },
      modalId: 'add-unit',
    }),
    methods: {
      ...mapActions(['storeUnit']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      async submit() {
        try {
          this.resetInvalid();
          await this.storeUnit({
            name: this.form.unitName,
          });
          Notify.success('Berhasil menambah satuan');
          this.$emit('unit-added');
          this.resetForm();
          this.hideModal(this.modalId);
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
      resetForm() {
        for (const formIdx in this.form) {
          this.form[formIdx] = '';
        }
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
