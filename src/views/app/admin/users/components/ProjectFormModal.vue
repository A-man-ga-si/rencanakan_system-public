<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    title="Edit Proyek"
    @show="onModalShown"
  >
    <b-form-group :label="'Nama Proyek'" class="has-float-label">
      <b-form-input type="text" v-model="form.name" />
    </b-form-group>
    <b-form-group :label="'Paket'" class="has-float-label">
      <v-select
        label="name"
        v-model="form.subscriptionId"
        :reduce="(subscription) => subscription.id"
        :options="subscriptions"
      />
    </b-form-group>
    <input-date-picker :label="'Expired Date'" v-model="form.expiredDate" />
    <template slot="modal-footer">
      <loader-circle v-if="isSubmitting" />
      <div v-else style="display: flex">
        <b-button
          @click.prevent="onClickSaveButton"
          variant="primary"
          class="mr-2"
        >
          Simpan
        </b-button>
        <b-button variant="secondary" @click="() => this.$refs[modalId].hide()">
          Batal
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
  import moment from 'moment';
  import { mapActions } from 'vuex';
  import { InputDatePicker, LoaderCircle } from '@/components/Common';

  export default {
    props: {
      subscriptions: [],
      project: {
        type: Object,
        default: () => ({ name: '', subscription_id: '' }),
      },
    },
    data() {
      return {
        modalId: 'admin-project-form-modal',
        isSubmitting: false,
        form: { name: '', subscriptionId: '', expiredDate: '' },
      };
    },
    methods: {
      ...mapActions(['putAdminProject']),
      setupInitialValue() {
        this.form.name = this.project.name;
        this.form.subscriptionId = this.project.subscription_id;
        this.form.expiredDate = this.project.activeOrder.expired_at;
      },
      onModalShown() {
        this.$nextTick(this.setupInitialValue);
      },
      async onClickSaveButton() {
        this.isSubmitting = true;
        await this.putAdminProject({
          ...this.form,
          hashId: this.project.hashid,
        });
        this.isSubmitting = false;
        this.$refs[this.modalId].hide();
        this.$emit('on-update-project');
      },
    },
    components: {
      InputDatePicker,
      LoaderCircle,
    },
  };
</script>
