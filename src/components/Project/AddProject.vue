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
  </b-modal>
</template>

<script>

import { mapActions } from 'vuex';
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
      fiscalYear: new Date().getFullYear(),
      marginProfit: 10,
      ppn: 10,
    },
    processedProvinces: [],
  }),
  props: {
    provinces: Array,
  },
  mounted() {
    if (this.shouldShowTutorial('create_project')) {
      console.log('asgasfa')
      this.submitProjectButtonTutorial = this.activateTutorial()
    }
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    async submit() {
      try {
        this.isSubmitting = true
        this.resetInvalid();
        await this.createProject(this.form);
        this.$emit('project-added');
        this.hideModal(this.modalId);
        this.resetForm();
        Notify.success('Berhasil membuat project baru');
      } catch (err) {
        this.checkForInvalidResponse(err);
      } finally {
        this.isSubmitting = false
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
    ...mapActions(['createProject']),
  },
  components: {
    ValidationInput,
    TutorialPopover
  },
};
</script>
