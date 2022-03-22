<template>
  <div class="profile">
    <b-row>
      <b-col :md="6" class="mx-auto">
        <div class="text-center">
          <b-avatar
            class="border-0"
            variant="white"
            size="8rem"
            :src="profileImage"
          />
          <a
            class="d-block mt-3 change-foto text-link text-primary"
            href="#"
            @click.prevent="changePhoto"
          >
            {{ $t('pages.account.profile.change-photo') }}
          </a>
          <input type="file" id="profile-photo-input" class="d-none" />
        </div>
        <div class="form-section mt-4">
          <form @submit.prevent="updateProfile" class="profile-update-form">
            <ValidationInput
              class="mb-3"
              v-model="form.firstName"
              field-name="first_name"
              :label="$t('pages.account.profile.first-name')"
            />
            <ValidationInput
              class="mb-3"
              v-model="form.lastName"
              field-name="last_name"
              :label="$t('pages.account.profile.last-name')"
            />
            <ValidationInput
              class="mb-3"
              type="number"
              v-model="form.phone"
              field-name="phone"
              :label="$t('pages.account.profile.phone')"
            />
            <ValidationInput
              class="mb-3"
              v-model="form.job"
              field-name="job"
              :label="$t('pages.account.profile.job')"
            />
            <b-btn
              type="submit"
              variant="primary"
              class="mx-auto"
              :disabled="processing"
              :class="{
                'show-spinner': processing,
                'btn-multiple-state btn-shadow': true,
              }"
            >
              <span class="spinner d-inline-block">
                <span class="bounce1"></span>
                <span class="bounce2"></span>
                <span class="bounce3"></span>
              </span>
              <span class="label">
                {{ $t('pages.account.profile.save-btn') }}
              </span>
            </b-btn>
          </form>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';
  import validationMixin from '@/mixins/validation-mixins';
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import { apiDomain, defaultProfilePictureName } from '@/constants/config';

  export default {
    mixins: [validationMixin],
    data: () => ({
      formDisabled: true,
      processing: false,
      form: {
        firstName: '',
        lastName: '',
        phone: '',
        job: '',
      },
      errors: {
        first_name: '',
        last_name: '',
        phone: '',
        job: '',
      },
      fileInput: null,
    }),
    created() {
      // TODO: Make current user data reusable !
      this.fetchCurrentUserInfo();
    },
    mounted() {
      this.fileInput = document.querySelector('#profile-photo-input');
      this.scanOnFileChangedListener();
    },
    methods: {
      async fetchCurrentUserInfo() {
        try {
          const { data } = await this.fetchUserInfo(this.currentUser.id);
          const { first_name, last_name, job, phone } = data.data.user;
          this.form = {
            job,
            phone,
            firstName: first_name,
            lastName: last_name,
          };
          this.formDisabled = false;
        } catch (err) {
          console.error(err);
        }
      },
      changePhoto() {
        this.fileInput.click();
      },
      scanOnFileChangedListener() {
        const context = this;
        this.fileInput.addEventListener('change', function (e) {
          if (e.target.files) {
            const fd = new FormData();
            fd.append('photo-update', e.target.files[0]);
            context.updateProfilePhoto(fd);
          }
        });
      },
      async updateProfile() {
        try {
          this.processing = true;
          this.resetInvalid();
          const { firstName, lastName, phone, job } = this.form;
          await this.updateUserInfo({
            userId: this.currentUser.id,
            data: {
              first_name: firstName,
              last_name: lastName,
              phone,
              job,
            },
          });
          Notify.success('Berhasil mengupdate profil');
        } catch (err) {
          this.checkForInvalidResponse(err);
        } finally {
          this.processing = false;
        }
      },
      async updateProfilePhoto(formData) {
        try {
          this.processing = true;
          await this.updateUserPhoto({
            userId: this.currentUser.id,
            formData,
          });
          Notify.success('Berhasil mengupdate foto profil');
        } catch (err) {
          console.error(err);
          if (err.response?.status == 422)
            Notify.failure(err.response.data.errors['photo-update'][0]);
          Notify.failure('Gagal mengupdate foto profil');
        } finally {
          this.processing = false;
        }
      },
      ...mapActions(['fetchUserInfo', 'updateUserInfo', 'updateUserPhoto']),
    },
    computed: {
      ...mapGetters(['currentUser']),
      profileImage() {
        return this.currentUser?.img
          ? `${apiDomain}/storage/uploads/users/profile-photo/${this.currentUser.img}`
          : `${apiDomain}/assets/images/${defaultProfilePictureName}`;
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>

<style scoped>
  .profile-img {
    max-width: 150px;
  }

  .change-foto {
    font-size: 15px;
    text-decoration: underline;
  }
</style>
