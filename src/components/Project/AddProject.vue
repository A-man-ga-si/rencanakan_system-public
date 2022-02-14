<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    :title="$t('pages.projects.add-project-modal-title')"
  >
    <ValidationInput
      v-model="form.name"
      class="mb-3"
      field-name="name"
      label="Nama Pekerjaan"
    />
    <ValidationInput
      v-model="form.activity"
      class="mb-3"
      field-name="activity"
      label="Kegiatan"
    />
    <ValidationInput
      v-model="form.job"
      class="mb-3"
      field-name="job"
      label="Pekerjaan"
    />
    <ValidationInput
      v-model="form.address"
      class="mb-3"
      field-name="address"
      label="Alamat"
    />
    <b-form-group
      :label="$t('pages.projects.province')"
      class="has-float-label"
    >
      <v-select
        v-model="form.provinceId"
        label="name"
        :reduce="province => province.hashid"
        :options="provinces"
      />
    </b-form-group>
    <ValidationInput
      v-model="form.fiscalYear"
      class="mb-3"
      field-name="fiscal_year"
      label="Tahun Anggaran"
    />
    <ValidationInput
      v-model="form.marginProfit"
      class="mb-3"
      field-name="profit_margin"
      label="Margin Profit & Overhead (%)"
    />
    <ValidationInput
      v-model="form.ppn"
      class="mb-3"
      field-name="ppn"
      label="PPN (%)"
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
</template>

<script>
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixin from '@/mixins/validation-mixins';
  import { mapActions } from 'vuex';
  export default {
    mixins: [validationMixin],
    data: () => ({
      modalId: 'add-project-modal',
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
    methods: {
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      async submit() {
        try {
          this.resetInvalid();
          await this.createProject(this.form);
          this.$emit('project-added');
          this.hideModal(this.modalId);
          this.resetForm();
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
      ...mapActions(['createProject']),
    },
    components: {
      ValidationInput,
    },
  };
</script>
