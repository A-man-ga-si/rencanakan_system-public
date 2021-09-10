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
            <div class="mb-4">
              <label class="form-group has-float-label mb-0">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'border-danger': errors.first_name }"
                  v-model="form.firstName"
                />
                <span :class="{ 'text-danger': errors.first_name }">
                  {{ $t('pages.account.profile.first-name') }}
                </span>
              </label>
              <span
                v-if="errors.first_name"
                for=""
                class="mt-1 d-block text-danger error-msg"
              >
                {{ errors.first_name }}
              </span>
            </div>
            <div class="mb-4">
              <label class="form-group has-float-label mb-0">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'border-danger': errors.last_name }"
                  v-model="form.lastName"
                />
                <span :class="{ 'text-danger': errors.last_name }">
                  {{ $t('pages.account.profile.last-name') }}
                </span>
              </label>
              <span
                v-if="errors.last_name"
                for=""
                class="mt-1 d-block text-danger error-msg"
              >
                {{ errors.last_name }}
              </span>
            </div>
            <div class="mb-4">
              <label class="form-group has-float-label mb-0">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'border-danger': errors.phone }"
                  v-model="form.phone"
                />
                <span :class="{ 'text-danger': errors.phone }">
                  {{ $t('pages.account.profile.phone') }}
                </span>
              </label>
              <span
                v-if="errors.phone"
                for=""
                class="mt-1 d-block text-danger error-msg"
              >
                {{ errors.phone }}
              </span>
            </div>
            <div class="mb-4">
              <label class="form-group has-float-label mb-0">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'border-danger': errors.job }"
                  v-model="form.job"
                />
                <span :class="{ 'text-danger': errors.job }">
                  {{ $t('pages.account.profile.job') }}
                </span>
              </label>
              <span
                v-if="errors.job"
                for=""
                class="mt-1 d-block text-danger error-msg"
              >
                {{ errors.job }}
              </span>
            </div>
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
  import { Notify } from 'notiflix';
  import { mapActions, mapGetters } from 'vuex';
  import { apiDomain } from '../../../constants/config';

  export default {
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
          // TODO: Make validation process general
          switch (err.response?.status) {
            case 422:
              this.markInvalids(err.response.data);
              break;
            default:
              Notify.failure('Gagal mengupdate profil');
              console.error(err);
              break;
          }
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
      markInvalids(invalids) {
        this.resetInvalid();
        for (const invalidField in invalids.errors) {
          this.errors[invalidField] = invalids.errors[invalidField][0];
        }
      },
      resetInvalid() {
        this.errors = {};
      },
      ...mapActions(['fetchUserInfo', 'updateUserInfo', 'updateUserPhoto']),
    },
    computed: {
      ...mapGetters(['currentUser']),
      profileImage() {
        return this.currentUser
          ? `${apiDomain}/storage/uploads/users/profile-photo/${this.currentUser.img}`
          : '#';
      },
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
