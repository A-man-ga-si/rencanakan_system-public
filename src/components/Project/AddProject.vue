<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    :title="$t('pages.projects.add-project-modal-title')"
  >
    <b-form-group
      :label="$t('pages.projects.project-name')"
      class="has-float-label"
    >
      <b-form-input type="text" v-model="form.name" />
    </b-form-group>
    <b-form-group
      :label="$t('pages.projects.activity')"
      class="has-float-label"
    >
      <b-form-input type="text" v-model="form.activity" />
    </b-form-group>
    <b-form-group :label="$t('pages.projects.job')" class="has-float-label">
      <b-form-input type="text" v-model="form.job" />
    </b-form-group>
    <b-form-group :label="$t('pages.projects.address')" class="has-float-label">
      <b-form-input type="text" v-model="form.address" />
    </b-form-group>
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
    <b-form-group
      :label="$t('pages.projects.fiscal-year')"
      class="has-float-label"
    >
      <b-form-input type="text" v-model="form.fiscalYear" />
    </b-form-group>
    <b-form-group
      :label="$t('pages.projects.margin-profit')"
      class="has-float-label"
    >
      <b-form-input type="text" v-model="form.marginProfit" />
    </b-form-group>
    <b-form-group label="PPN (%)" class="has-float-label">
      <b-form-input type="text" v-model="form.ppn" />
    </b-form-group>
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
  import { mapActions } from 'vuex';
  export default {
    data: () => ({
      modalId: 'add-project-modal',
      form: {
        name: '',
        activity: '',
        job: '',
        address: '',
        provinceId: 0,
        fiscalYear: new Date().getFullYear(),
        marginProfit: 0,
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
        await this.createProject(this.form);
        this.$emit('project-added');
        this.hideModal(this.modalId);
      },
      ...mapActions(['createProject']),
    },
  };
</script>
