<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Edit AHS">
      <ValidationInput
        :label="'Kode'"
        field-name="code"
        v-model="form.code"
        class="mb-4"
      />
      <ValidationInput
        :label="'Name'"
        field-name="name"
        v-model="form.name"
        class="mb-4"
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
  import validationMixins from '@/mixins/validation-mixins';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixins],
    props: ['editedCustomAhs'],
    data() {
      return {
        modalId: 'edit-custom-ahs',
        form: {
          name: '',
          code: '',
        },
      };
    },
    methods: {
      ...mapActions(['storeCustomAhs', 'updateCustomAhs']),
      async submit() {
        try {
          const { name, code } = this.form;
          await this.updateCustomAhs({
            projectId: this.$route.params.id,
            customAhsId: this.editedCustomAhs.hashid,
            form: {
              name,
              code,
            },
          });
          Notify.success('Berhasil mengupdate AHS');
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('custom-ahs-updated');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal menambahkan AHS');
        }
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      resetForm() {
        this.form.name = '';
        this.form.code = '';
      },
    },
    watch: {
      editedCustomAhs() {
        this.form.name = this.editedCustomAhs.name;
        this.form.code = this.editedCustomAhs.code;
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
