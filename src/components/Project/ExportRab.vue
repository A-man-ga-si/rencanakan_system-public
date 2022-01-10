<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Export RAB">
      <div class="export-form">
        <h5>Status Export</h5>
        <b-badge variant="success">Terbuka</b-badge>
      </div>
      <template slot="modal-footer">
        <b-button @click.prevent="submit" variant="primary" class="mr-1">
          Export
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
  import { apiDomain } from '../../constants/config';
  import { getToken } from '../../utils';

  export default {
    mixins: [validationMixins],
    data() {
      return {
        modalId: 'export-rab',
        isExportLocked: false,
        form: {
          name: '',
        },
      };
    },
    methods: {
      ...mapActions(['storeRab', 'fetchSnapToken', 'exportProject']),
      async submit() {
        try {
          if (this.isExportLocked) {
            this.pay();
          } else {
            const xlsxBlob = await this.exportProject({
              projectId: this.$route.params.id,
            });
            const fileLink = document.createElement('a');
            fileLink.href = window.URL.createObjectURL(xlsxBlob);
            fileLink.download = 'export_rab.xlsx';
            fileLink.click();
          }
        } catch (err) {
          Notify.failure('Terjadi kesalahan saat melakukan export RAB !');
          console.error(err);
        }
      },

      async pay() {
        const { data } = await this.fetchSnapToken(this.$route.params.id);
        window.snap.pay(data.data.token, {
          onSuccess: () => {},
        });
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
