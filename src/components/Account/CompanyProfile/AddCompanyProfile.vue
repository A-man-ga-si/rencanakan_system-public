<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    :title="$t('pages.account.company-profile.add-company-profile-bt')"
  >
    <b-form-group
      :label="$t('pages.account.company-profile.name')"
      class="has-float-label"
    >
      <b-form-input type="text" v-model="form.name" />
    </b-form-group>
    <b-form-group
      :label="$t('pages.account.company-profile.email')"
      class="has-float-label"
    >
      <b-form-input type="text" v-model="form.email" />
    </b-form-group>
    <b-form-group
      :label="$t('pages.account.company-profile.director')"
      class="has-float-label"
    >
      <b-form-input type="text" v-model="form.directorName" />
    </b-form-group>
    <b-form-group
      :label="$t('pages.account.company-profile.phone-number')"
      class="has-float-label"
    >
      <b-form-input type="text" v-model="form.phoneNumber" />
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
  import { mapActions, mapGetters } from 'vuex';
  export default {
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
          const { name, email, directorName, phoneNumber } = this.form;
          const data = await this.addCompanyProfile({
            name,
            email,
            director_name: directorName,
            phone_number: phoneNumber,
          });
          this.hideModal(this.modalId);
          this.resetForm();
        } catch (err) {
          console.error(err);
          this.$notify(
            'error',
            'Server Error',
            'Error when trying to create company profile',
            {
              duration: 3000,
              permanent: false,
            }
          );
        }
      },
    },
  };
</script>
