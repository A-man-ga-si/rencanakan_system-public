<template>
  <b-modal :id="modalId" :ref="modalId" :title="$t('pages.projects.add-project-modal-title')">
    <ValidationInput v-model="form.name" class="mb-3" field-name="name" label="Nama Pekerjaan" />
    <ValidationInput v-model="form.activity" class="mb-3" field-name="activity" label="Kegiatan" />
    <ValidationInput v-model="form.job" class="mb-3" field-name="job" label="Pekerjaan" />
    <ValidationInput v-model="form.address" class="mb-3" field-name="address" label="Alamat" />
    <b-form-group :label="$t('pages.projects.province')" class="has-float-label">
      <v-select v-model="form.provinceId" label="name" :reduce="province => province.hashid" :options="provinces" />
    </b-form-group>
    <ValidationInput v-model="form.fiscalYear" class="mb-3" field-name="fiscal_year" label="Tahun Anggaran" />
    <ValidationInput v-model="form.marginProfit" class="mb-3" field-name="profit_margin"
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
      <v-select v-model="form.subscription_id" label="name" :reduce="subscription => subscription.id" :options="currentUser.demo_quota > 0 ? demoSubscriptionOnly : withoutDemoOnly" />
      <a href="#" @click.prevent class="mt-1 d-block" v-b-modal.subscription-comparison-modal><u>Bandingkan Paket</u></a>
    </b-form-group>
  </b-modal>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import { Notify } from 'notiflix';
import tutorialMixin from '@/mixins/tutorial-mixin'
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
      return this.getSubscriptions.filter(subscription => subscription.is_show == 1)
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
        
        this.runPaymentGateway()
      } catch (err) {
        this.checkForInvalidResponse(err);
      } finally {
        this.isSubmitting = false
      }
    },
    async runPaymentGateway() {
      // TODO: Check for demo eligibilty again
      try {
        const data = await this.fetchSubscriptionSnapToken({
          subscription_id: this.form.subscription_id
        })
        const snapToken = data.data.data.snap_token
        const that = this
        window.snap.pay(snapToken, {
            onSuccess: async () => {
              await that.createProject(this.form);
              that.$emit('project-added');
              that.hideModal(that.modalId);
              that.resetForm();
              Notify.success('Berhasil membuat project baru');
            },
            onPending() {

            },
            onError() {

            },
            onClose() {

            },
            skipOrderSummary: false,
        });
        // return false
        // console.log(data)
      } catch (err) {
        console.log(err)
        alert('Error !')
      }
    },
    resetForm() {
      this.form = {
        name: '',
        activity: '',
        job: '',
        address: '',
        provinceId: 'qMxAPZX0',
        fiscalYear: new Date().getFullYear(),
        marginProfit: 10,
        ppn: 10,
      };
    },
    ...mapActions(['createProject', 'fetchSubscriptions', 'fetchSubscriptionSnapToken']),
  },
  components: {
    ValidationInput,
    TutorialPopover
  },
};
</script>
