<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Export RAB">
      <div class="export-form">
        <h5>Status Export</h5>
        <b-badge variant="secondary" v-if="!fetchQuotaStatus"
          >Loading...</b-badge
        >
        <b-badge :variant="quotasLeft > 0 ? 'success' : 'danger'" v-else>{{
          quotasLeft > 0 ? 'Terbuka' : 'Terkunci'
        }}</b-badge>
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
        fetchQuotaStatus: false,
        quotasLeft: 0,
        form: {
          name: '',
        },
      };
    },
    created() {
      this.checkQuotas();
    },
    methods: {
      ...mapActions([
        'storeRab',
        'fetchSnapToken',
        'exportProject',
        'checkOrder',
      ]),
      async submit() {
        try {
          if (this.fetchQuotaStatus && this.quotasLeft > 0) {
            const xlsxBlob = await this.exportProject({
              projectId: this.$route.params.id,
            });
            const fileLink = document.createElement('a');
            fileLink.href = window.URL.createObjectURL(xlsxBlob);
            fileLink.download = 'export_rab.xlsx';
            fileLink.click();
            this.checkQuotas();
          } else {
            this.pay();
          }
        } catch (err) {
          Notify.failure('Terjadi kesalahan saat melakukan export RAB !');
          console.error(err);
        }
      },
      async checkQuotas() {
        const data = await this.checkOrder({
          projectId: this.$route.params.id,
        });
        this.fetchQuotaStatus = true;
        this.quotasLeft = data.data.data.quotasLeft;
      },
      async pay() {
        const { data } = await this.fetchSnapToken(this.$route.params.id);
        const that = this;
        window.snap.pay(data.data.token, {
          onSuccess: () => {
            that.checkQuotas();
          },
          skipOrderSummary: false,
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
