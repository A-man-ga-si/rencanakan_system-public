<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Tambah RAB">
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
    data() {
      return {
        modalId: 'add-master-rab',
        form: {
          name: '',
        },
      };
    },
    methods: {
      ...mapActions(['storeMasterRab']),
      async submit() {
        try {
          await this.storeMasterRab({
            form: this.form,
          });
          Notify.success('Berhasil Menambah Master RAB baru');
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('master-rab-added');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal menambahkan Master RAB');
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
