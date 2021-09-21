<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    :title="$t('pages.account.company-profile.add-company-profile-bt')"
  >
    <ValidationInput
      v-model="form.name"
      class="mb-3"
      field-name="name"
      :label="$t('pages.account.company-profile.name')"
    />
    <ValidationInput
      v-model="form.email"
      class="mb-3"
      field-name="email"
      :label="$t('pages.account.company-profile.email')"
    />
    <ValidationInput
      v-model="form.directorName"
      class="mb-3"
      field-name="director_name"
      :label="$t('pages.account.company-profile.director')"
    />
    <ValidationInput
      v-model="form.phoneNumber"
      class="mb-3"
      field-name="phone_number"
      :label="$t('pages.account.company-profile.phone-number')"
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
  import validationMixin from './../../../mixins/validation-mixins';
  import ValidationInput from './../../Common/ValidationInput.vue';
  import { mapActions } from 'vuex';

  export default {
    mixins: [validationMixin],
    data: () => ({
      form: {
        name: '',
        email: '',
        directorName: '',
        phoneNumber: '',
      },
      modalId: 'add-company',
    }),
    methods: {
      ...mapActions(['addCompanyProfile']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      resetForm() {
        this.form = {
          name: '',
          email: '',
          directorName: '',
          phoneNumber: '',
        };
      },
      async submit() {
        try {
          this.resetInvalid();
          const { name, email, directorName, phoneNumber } = this.form;
          console.log(this.form);
          await this.addCompanyProfile({
            name,
            email,
            director_name: directorName,
            phone_number: phoneNumber,
          });
          this.hideModal(this.modalId);
          this.resetForm();
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
