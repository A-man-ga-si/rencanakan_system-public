<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Edit Header Master RAB">
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
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixins from '@/mixins/validation-mixins';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixins],
    props: ['editedRabItemHeader', 'rab'],
    data() {
      return {
        modalId: 'edit-rab-item-header',
        form: {
          name: '',
        },
      };
    },
    methods: {
      ...mapActions(['updateMasterRabItemHeader']),
      async submit() {
        try {
          await this.updateMasterRabItemHeader({
            rabId: this.rab.hashid,
            masterRabItemHeader: this.editedRabItemHeader.hashid,
            form: this.form,
          });

          this.hideModal(this.modalId);
          this.resetForm();

          this.$emit('rab-item-header-updated');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal mengupdate Header RAB');
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
      editedRabItemHeader() {
        this.form.name = this.editedRabItemHeader.name;
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
