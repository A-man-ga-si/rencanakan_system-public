<template>
  <b-modal :id="modalId" :ref="modalId" :title="$t('pages.projects.add-project-modal-title')">
    <ValidationInput v-model="form.name" class="mb-3" field-name="name" label="Nama Pekerjaan" />
    <ValidationInput v-model="form.activity" class="mb-3" field-name="activity" label="Kegiatan" />
    <ValidationInput v-model="form.job" class="mb-3" field-name="job" label="Pekerjaan" />
    <ValidationInput v-model="form.address" class="mb-3" field-name="address" label="Alamat" />
    <b-form-group :label="$t('pages.projects.province')" class="has-float-label">
      <v-select v-model="form.provinceId" label="name" :reduce="province => province.hashid" :options="provinces" />
    </b-form-group>
    <ValidationInput type="number" v-model="form.fiscalYear" class="mb-3" field-name="fiscal_year" label="Tahun Anggaran" />
    <ValidationInput type="number" v-model="form.marginProfit" class="mb-3" field-name="profit_margin"
      label="Margin Profit & Overhead (%)" />
    <ValidationInput v-model="form.ppn" class="mb-3" field-name="ppn" label="PPN (%)" />
    <template slot="modal-footer">
      <b-button v-b-modal.submit-btn @click.prevent="submit" variant="primary" class="mr-1" :disabled="isSubmitting">
        <tutorial-popover target="submit-btn" title="Simpan Project" :is-show.sync="submitProjectButtonTutorial" tutorial-key="create_project"
          :end-of-tutorial="false">
          Tekan tombol ini untuk menyimpan project anda
        </tutorial-popover>
        <span v-if="isSubmitting">
          Memuat...
        </span>
        <span v-else>
          {{ $t('modal.save-bt') }}
        </span>
      </b-button>
      <b-button variant="secondary" @click="hideModal(modalId)">
        {{ $t('modal.cancel-bt') }}
      </b-button>
    </template>
    <b-form-group label="Paket Project" class="has-float-label">
      <v-select
        ref="selectedEl"
        label="name"
        v-model="form.subscription_id"
        :reduce="subscription => subscription.id"
        :options="currentUser.demo_quota > 0 ? demoSubscriptionOnly : withoutDemoOnly"
        :searchable="false"
      />
      <a href="#" @click.prevent class="mt-1 d-block" v-b-modal.subscription-comparison-modal-new><u>Bandingkan Paket</u></a>
    </b-form-group>
  </b-modal>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import { Notify } from 'notiflix';
import tutorialMixin from '@/mixins/tutorial-mixin'
import { setCurrentUser, getCurrentUser } from '@/utils';
import ValidationInput from '@/components/Common/ValidationInput.vue';
import validationMixin from '@/mixins/validation-mixins';
import TutorialPopover from '@/components/Common/TutorialPopover.vue';

export default {
  mixins: [validationMixin, tutorialMixin],
  data: () => ({
    isSubmitting: false,
    modalId: 'add-project-modal',
    submitProjectButtonTutorial: false,
    form: {
      name: '',
      activity: '',
      job: '',
      address: '',
      provinceId: 'qMxAPZX0',
      subscription_id: '',
      fiscalYear: new Date().getFullYear(),
      marginProfit: 10,
      ppn: 11,
    },
    processedProvinces: [],
  }),
  props: {
    provinces: Array,
  },
  created() {
    this.fetchSubscriptions()
  },
  mounted() {
    if (this.shouldShowTutorial('create_project')) {
      this.submitProjectButtonTutorial = this.activateTutorial()
    }
  },
  computed: {
    ...mapGetters(['getSubscriptions', 'currentUser']),
    demoSubscriptionOnly() {
      this.form.subscription_id = 'demo'
      return this.getSubscriptions.filter(subscription => subscription.is_show == 0)
    },
    withoutDemoOnly() {
      const filteredSubscription = this.getSubscriptions.filter(subscription => subscription.is_show == 1)
      this.form.subscription_id = filteredSubscription?.length > 0 ? filteredSubscription[0].id : ''
      return filteredSubscription
    },
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    chooseSubscription(subscriptionId) {
      this.form.subscription_id = subscriptionId
    },
    async submit() {
      try {
        //TODO:Check demo eligibility
        // 
        this.isSubmitting = true
        this.resetInvalid();

        // FIXME: Patch this client side validation to separate file

        const errorMessage = {}
        
        for (const formKey in this.form) {
          if (this.form[formKey] == '' || this.form[formKey] == null) {
            errorMessage[formKey] = [`Kolom ${formKey} wajib diisi`]
          }
        }

        if (Object.keys(errorMessage).length) {
          this.processInvalid({
            errors: errorMessage
          })
          return
        }

        this.runPaymentGateway()
      } catch (err) {
        this.checkForInvalidResponse(err);
        this.isSubmitting = false
      } finally {
        this.isSubmitting = false
      }
    },
    async runPaymentGateway() {
      // TODO: Check for demo eligibilty again
      try {

        this.isSubmitting = true

        const that = this

        if (this.form.subscription_id == 'demo') {

            // FIXME: Project creation supposed to be triggered from backend
            await that.createProject(this.form);

            that.$emit('project-added');
            that.hideModal(that.modalId);
            that.resetForm();

            this.verifyToken()
            this.isSubmitting = false

            Notify.success('Berhasil membuat project baru');

        } else {

            // NOTE: Fetch subscriptionSnapToken will make temporary project too
            const data = await this.fetchSubscriptionSnapToken({
                subscription_id: this.form.subscription_id,
                name: this.form.name,
                activity: this.form.activity,
                job: this.form.job,
                address: this.form.address,
                province_id: this.form.provinceId,
                fiscal_year: this.form.fiscalYear,
                margin_profit: this.form.marginProfit,
                ppn: this.form.ppn,
                type: 'create',
            })

            if (data.status != 200) {
                throw new Error(data.message)
            }

            const snapToken = data.data.data.snap_token

            window.snap.pay(snapToken, {
                onSuccess: async () => {
                  
                    // FIXME: Don't call createProject here. Project creation should be done in backend.
                    // await that.createProject(this.form);

                    //  Update for pending
                    // FIXME: We need to make a prioritize while updating the order status to prevent race condition between our API call and
                    // Payment gateway's webhook call.
                    await that.setPending({
                      snapToken
                    })

                    that.$emit('project-added');
                    that.hideModal(that.modalId);
                    that.resetForm();

                    that.isSubmitting = false

                    Notify.success('Berhasil membuat project baru');
                },

                async onPending() {
                    await that.setPending({
                      snapToken
                    })
                    that.isSubmitting = false
                },
                onError() {
                    Notify.failure('Tidak dapat melanjutkan pembayaran. Hubungi CS untuk informasi lebih lanjut');
                    that.isSubmitting = false
                },
                onClose() {
                    Notify.failure('Pembuatan proyek tidak dapat dilanjutkan karena pembayaran telah dibatalkan.');
                    that.setCanceled({
                      snapToken
                    })
                    that.isSubmitting = false
                    // Delete order
                },
                skipOrderSummary: false,
            });
        }

      } catch (err) {
        console.log(err)
        Notify.failure(err?.response?.data?.message || 'Error tidak diketahui saat membuat project')
      }
    },
    resetForm() {
      this.form = {
        name: '',
        activity: '',
        job: '',
        address: '',
        provinceId: 'qMxAPZX0',
        subscription_id: '',
        fiscalYear: new Date().getFullYear(),
        marginProfit: 10,
        ppn: 10,
      };
    },
    ...mapActions(['createProject', 'fetchSubscriptions', 'fetchSubscriptionSnapToken', 'setCanceled', 'setPending', 'verifyToken']),
  },
  components: {
    ValidationInput,
    TutorialPopover
  },
};
</script>
