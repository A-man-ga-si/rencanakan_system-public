<template>
  <div class="edit-company-profile">
    <form
      action=""
      @submit.prevent="updateCompanyProfile"
      class="company-profile-form-el"
    >
      <div class="text-center mb-4">
        <b-avatar
          class="border-0 mb-2"
          variant="white"
          size="8rem"
          :src="companyImage"
        />
        <label
          for="company-image"
          class="d-block change-foto text-link text-primary"
        >
          Change Photo
        </label>
        <input
          name="update_picture"
          type="file"
          id="company-image"
          class="d-none"
        />
      </div>
      <div class="company-profile-form">
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
      </div>
      <b-btn type="submit" variant="primary">Update</b-btn>
    </form>
  </div>
</template>

<script>
  import { Notify } from 'notiflix';
  import { mapActions, mapGetters } from 'vuex';
  import { apiDomain } from '../../../constants/config';

  export default {
    data: () => ({
      form: {
        name: '',
        email: '',
        directorName: '',
        phoneNumber: '',
      },
      companyProfileInput: null,
    }),
    mounted() {
      this.companyProfileFormData = document.querySelector(
        '.company-profile-form-el'
      );
      this.companyProfileInput = document.querySelector('#company-image');
      const context = this;
      this.companyProfileInput.addEventListener('change', function () {
        if (this.value) context.updateCompanyPicture();
      });
    },
    computed: {
      ...mapGetters(['getCompany']),
      companyImage() {
        return this.getCompany.picture
          ? `${apiDomain}/storage/uploads/company/profile-picture/${this.getCompany.picture}`
          : '#';
      },
    },
    created() {
      const { name, email, director_name, phone_number } = this.getCompany;
      this.form = {
        name,
        email,
        directorName: director_name,
        phoneNumber: phone_number,
      };
    },
    methods: {
      ...mapActions(['updateCompany']),
      async updateCompanyProfile() {
        try {
          await this.updateCompany({
            companyId: this.getCompany.id,
            form: {
              name: this.form.name,
              email: this.form.email,
              phone_number: this.form.phoneNumber,
              director_name: this.form.directorName,
            },
          });
          Notify.success('Berhasil mengupdate profil perusahaan');
        } catch (err) {
          console.error(err);
          Notify.failure('Error saat mencoba mengupdate profil perusahaan');
        }
      },
      async updateCompanyPicture() {
        try {
          await this.updateCompany({
            companyId: this.getCompany.id,
            form: new FormData(this.companyProfileFormData),
          });
          this.companyProfileInput.value = '';
          Notify.success('Berhasil mengupdate profil perusahaan');
        } catch (err) {
          Notify.failure('Error saat mencoba mengupdate profil perusahaan');
        }
      },
    },
  };
</script>

<style scoped>
  .change-photo-label {
    cursor: pointer;
  }

  .change-foto {
    cursor: pointer;
    font-size: 15px;
    text-decoration: underline;
  }
</style>
