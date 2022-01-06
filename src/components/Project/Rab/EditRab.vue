<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Edit RAB">
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
  import ValidationInput from '../../Common/ValidationInput.vue';
  import validationMixins from '../../../mixins/validation-mixins';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixins],
    props: ['editedRab'],
    data() {
      return {
        modalId: 'edit-rab',
        form: {
          name: '',
        },
      };
    },
    methods: {
      ...mapActions(['updateRab']),
      async submit() {
        try {
          await this.updateRab({
            projectId: this.$route.params.id,
            rabId: this.editedRab.hashid,
            form: this.form,
          });
          Notify.success('Berhasil mengubah RAB');
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('rab-updated');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal mengubah RAB');
        }
      },

      hideModal(refname) {
        this.$refs[refname].hide();
      },

      resetForm() {
        this.form.name = '';
      },
    },
    watch: {
      editedRab() {
        this.form.name = this.editedRab.name;
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
