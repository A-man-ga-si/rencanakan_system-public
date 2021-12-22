<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Tambah Header RAB">
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
    props: ['rab'],
    data() {
      return {
        modalId: 'add-rab-item-header',
        form: {
          name: '',
        },
      };
    },
    methods: {
      ...mapActions(['storeRabItemHeader']),
      async submit() {
        try {
          await this.storeRabItemHeader({
            projectId: this.$route.params.id,
            rabId: this.rab.hashid,
            form: this.form,
          });
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('rab-item-header-added');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal menambahkan Header RAB');
        }
      },

      hideModal(refname) {
        this.$refs[refname].hide();
      },

      resetForm() {
        this.form.name = '';
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
