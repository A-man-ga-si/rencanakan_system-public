<template>
  <b-modal :id="modalId" :ref="modalId" :title="'Update Custom AHP'">
    <ValidationInput
      class="mb-4"
      label="Kode"
      field-name="code"
      v-model="form.code"
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
    props: ['editedCustomAhp'],
    data: () => ({
      modalId: 'update-custom-ahp-modal',
      customAhpId: '',
      form: {
        code: '',
        name: '',
      },
    }),
    methods: {
      ...mapActions(['updateCustomAhp']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      resetForm() {
        this.form.code = '';
        this.form.name = '';
        this.customAhpId = '';
      },
      async submitForm() {
        try {
          this.resetInvalid();
          const data = await this.updateCustomAhp({
            customAhpId: this.customAhpId,
            projectId: this.$route.params.id,
            form: this.form,
          });
          this.hideModal(this.modalId);
          this.$emit('custom-ahp-updated');
          Notify.success('Sukses Mengupdate AHP');
          this.resetForm();
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
    },
    watch: {
      editedCustomAhp() {
        this.form.code = this.editedCustomAhp.code;
        this.form.name = this.editedCustomAhp.name;
        this.customAhpId = this.editedCustomAhp.hashid;
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
