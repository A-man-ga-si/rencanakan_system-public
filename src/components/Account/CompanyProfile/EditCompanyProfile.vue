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
          v-model="form.address"
          class="mb-3"
          field-name="address"
          :label="$t('pages.account.company-profile.address')"
        />
        <ValidationInput
          v-model="form.phoneNumber"
          class="mb-3"
          field-name="phone_number"
          :label="$t('pages.account.company-profile.phone-number')"
        />
      </div>
      <b-btn type="submit" variant="primary">Update</b-btn>
    </form>
  </div>
</template>

<script>
  import { Notify } from 'notiflix';
  import { mapActions, mapGetters } from 'vuex';
  import validationMixin from '@/mixins/validation-mixins';
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import { apiDomain, defaultCompanyPictureName } from '@/constants/config';

  export default {
    mixins: [validationMixin],
    data: () => ({
      form: {
        name: '',
        email: '',
        directorName: '',
        address: '',
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
          : `${apiDomain}/assets/images/${defaultCompanyPictureName}`;
      },
    },
    created() {
      const { name, email, director_name, phone_number, address } =
        this.getCompany;
      this.form = {
        name,
        email,
        address,
        directorName: director_name,
        phoneNumber: phone_number,
      };
    },
    methods: {
      ...mapActions(['updateCompany']),
      async updateCompanyProfile() {
        try {
          this.resetInvalid();
          await this.updateCompany({
            companyId: this.getCompany.id,
            form: {
              name: this.form.name,
              email: this.form.email,
              phone_number: this.form.phoneNumber,
              address: this.form.address,
              director_name: this.form.directorName,
            },
          });
          Notify.success('Berhasil mengupdate profil perusahaan');
        } catch (err) {
          console.error(err);
          this.checkForInvalidResponse(err);
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
          console.error(err);
          Notify.failure('Error saat mencoba mengupdate profil perusahaan');
        }
      },
    },
    components: {
      ValidationInput,
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
