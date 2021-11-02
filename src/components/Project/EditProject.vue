<template>
  <div class="edit-project">
    <b-modal :id="modalId" :ref="modalId" title="Edit Project">
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
      <b-form-group
        :label="$t('pages.projects.address')"
        class="has-float-label"
      >
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
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  export default {
    data() {
      return {
        modalId: 'edit-project',
        form: {
          name: '',
          activity: '',
          job: '',
          address: '',
          provinceId: 0,
          fiscalYear: '',
          marginProfit: 0,
        },
      };
    },
    props: ['selectedProject', 'provinces'],
    watch: {
      selectedProject() {
        const {
          name,
          activity,
          job,
          address,
          fiscal_year: fiscalYear,
          profit_margin: marginProfit,
        } = this.selectedProject;
        const provinceId = this.selectedProject.province.hashid;
        this.form = {
          name,
          activity,
          job,
          address,
          provinceId,
          fiscalYear,
          marginProfit,
        };
      },
    },
    methods: {
      ...mapActions(['updateProject']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      async submit() {
        const {
          name,
          activity,
          job,
          address,
          fiscalYear: fiscal_year,
          marginProfit: profit_margin,
        } = this.form;
        const province_id = this.form.provinceId;
        await this.updateProject({
          projectId: this.selectedProject.hashid,
          form: {
            name,
            activity,
            job,
            address,
            province_id,
            fiscal_year,
            profit_margin,
          },
        });
        this.$emit('project-edited');
        this.hideModal(this.modalId);
        Notify.success('Berhasil mengupdate satuan');
      },
    },
  };
</script>
