<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    :title="'Tambah AHS'"
    no-close-on-backdrop
  >
    <ValidationInput
      class="mb-4"
      label="Kode"
      field-name="id"
      v-model="form.id"
    />
    <ValidationInput
      class="mb-4"
      label="Nama"
      field-name="name"
      v-model="form.name"
    />
    <template slot="modal-footer">
      <b-button @click.prevent="submitForm" variant="primary" class="mr-1">
        {{ $t('modal.save-bt') }}
      </b-button>
      <b-button variant="secondary" @click="hideModal(modalId)">
        {{ $t('modal.cancel-bt') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixin from '@/mixins/validation-mixins';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixin],
    data: () => ({
      modalId: 'add-ahs-modal',
      form: {
        id: '',
        name: '',
      },
    }),
    methods: {
      ...mapActions(['storeAhs']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      resetForm() {
        this.form.id = '';
        this.form.name = '';
      },
      async submitForm() {
        try {
          this.resetInvalid();
          const data = await this.storeAhs(this.form);
          this.hideModal(this.modalId);
          this.$emit('ahs-added');
          Notify.success('Sukses Membuat AHS Baru');
          this.resetForm();
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
