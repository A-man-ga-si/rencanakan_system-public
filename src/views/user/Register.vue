<template>
  <b-row class="h-100 mt-5">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <div class="dark-overlay"></div>
          <div class="trans-overlay position-relative" style="z-index: 1">
            <p class="text-white h2">
              {{ $t('dashboards.magic-is-in-the-details') }}
            </p>
            <p class="white mb-0">
              Isi form untuk melakukan pendaftaran <br />Jika anda sudah
              mempunya akun, silahkan
              <router-link to="/auth/login" class="white"
                ><u>masuk</u></router-link
              >.
            </p>
          </div>
        </div>
        <div class="form-side">
          <router-link to="/">
            <b-img
              src="./../../assets/logos/rencanakan-logo-min.png"
              style="max-width: 250px"
              class="mb-5"
              fluid
            ></b-img>
            <!-- <span class="logo-single" /> -->
          </router-link>
          <h6 class="mb-4">{{ $t('user.register') }}</h6>
          <b-form @submit.prevent="formSubmit">
            <b-row class="mb-4">
              <b-col :sm="6">
                <label class="form-group has-float-label mb-0">
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'border-danger': errors.first_name }"
                    v-model="firstName"
                  />
                  <span :class="{ 'text-danger': errors.first_name }">
                    {{ $t('user.first-name') }}
                  </span>
                </label>
                <span
                  v-if="errors.first_name"
                  for=""
                  class="mt-1 d-block text-danger error-msg"
                >
                  {{ errors.first_name }}
                </span>
              </b-col>
              <b-col :sm="6" class="mt-4 mt-sm-0">
                <label class="form-group has-float-label mb-0">
                  <input
                    type="text"
                    :class="{ 'border-danger': errors.last_name }"
                    class="form-control"
                    v-model="lastName"
                  />
                  <span :class="{ 'text-danger': errors.last_name }">{{
                    $t('user.last-name')
                  }}</span>
                </label>
                <span
                  v-if="errors.last_name"
                  for=""
                  class="mt-1 d-block text-danger error-msg"
                >
                  {{ errors.last_name }}
                </span>
              </b-col>
            </b-row>
            <div class="mb-4">
              <label class="form-group has-float-label mb-0">
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'border-danger': errors.email }"
                  v-model="email"
                />
                <span :class="{ 'text-danger': errors.email }">{{
                  $t('user.email')
                }}</span>
              </label>
              <span
                v-if="errors.email"
                for=""
                class="mt-1 d-block text-danger error-msg"
              >
                {{ errors.email }}
              </span>
            </div>
            <div class="mb-4">
              <label class="form-group has-float-label mb-0">
                <input
                  type="number"
                  class="form-control"
                  :class="{ 'border-danger': errors.phone }"
                  v-model="phone"
                />
                <span :class="{ 'text-danger': errors.phone }">{{
                  $t('user.phone')
                }}</span>
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
              <div class="mb-2">
                <div
                  class="labeled-select position-relative d-inline-block"
                  style="width: 100%"
                >
                  <span class="px-1">{{ $t('user.job') }}</span>
                  <v-select
                    label="id_name"
                    v-model="job"
                    :options="[
                      'Kontraktor / Pemborong',
                      'Konsultan Perencana',
                      'Konsultan Pengawas',
                      'Pegawai Pemerintahan',
                      'Mahasiswa Teknik Sipil',
                      'Mahasiswa Arsitektur',
                      'Quatity Surveyor (QS)',
                      'Arsitek',
                      'Lainnya'
                    ]"
                  />
                </div>
              </div>

              <input
                v-show="job === 'Lainnya'"
                v-model="formData.otherJob"
                class="form-control"
                placeholder="Tuliskan pekerjaan anda"
              />

              <span
                v-show="errors.job"
                class="mt-1 d-block text-danger error-msg"
              >
                {{ errors.job }}
              </span>
            </div>
            <div class="mb-4">
              <label class="form-group has-float-label mb-0">
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'border-danger': errors.password }"
                  v-model="password"
                />
                <span :class="{ 'text-danger': errors.password }">{{
                  $t('user.password')
                }}</span>
              </label>
              <span
                v-if="errors.password"
                for=""
                class="mt-1 d-block text-danger error-msg"
              >
                {{ errors.password }}
              </span>
            </div>
            <div class="mb-4">
              <label class="form-group has-float-label mb-0">
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'border-danger': errors.password_confirmation }"
                  v-model="passwordConfirmation"
                />
                <span
                  :class="{ 'text-danger': errors.password_confirmation }"
                  >{{ $t('user.password-confirmation') }}</span
                >
              </label>
              <span
                v-if="errors.password_confirmation"
                for=""
                class="mt-1 d-block text-danger error-msg"
              >
                {{ errors.password_confirmation }}
              </span>
            </div>
            <div class="mb-4">
              <div class="form-group d-flex">
                <b-form-checkbox v-model="isTncChecked" class="itemCheck mb-0 d-inline-block" id="tnc-checkbox" />
                <label class="mb-0" for="">Dengan ini, saya menyatakan bahwa saya telah membaca dan menyetujui <a href="https://rencanakan.id/syarat-ketentuan/" target="_blank" style="text-decoration: underline;">Syarat dan Ketentuan</a>  yang berlaku pada Rencanakan.id</label>
              </div>
            </div>
            <div class="d-flex justify-content-end align-items-center">
              <router-link
                :to="{ name: 'Login' }"
                class="mr-3 login-bt text-primary"
              >
                {{ $t('user.login-button') }}
              </router-link>
              <b-button
                type="submit"
                variant="primary"
                :disabled="processing"
                size="lg"
                class="btn-shadow"
                :class="{
                  'btn-multiple-state btn-shadow': true,
                  'show-spinner': processing,
                }"
              >
                <span class="spinner d-inline-block">
                  <span class="bounce1"></span>
                  <span class="bounce2"></span>
                  <span class="bounce3"></span>
                </span>
                <span class="label">
                  {{ $t('user.register-button') }}
                </span>
              </b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix'

  export default {
    data() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        job: '',
        password: '',
        passwordConfirmation: '',
        errors: {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          job: '',
          password: '',
          password_confirmation: '',
        },
        isTncChecked: false,
        formData: {
          otherJob: ''
        }
      };
    },
    methods: {
      async formSubmit() {
          if (!this.isTncChecked) {
            Notify.failure('Centang persetujuan syarat dan ketentuan layanan untuk melanjutkan pendaftaran')
            return
          }

          const request = {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            phone: this.phone,
            job: this.job,
            password: this.password,
            password_confirmation: this.passwordConfirmation,
          };

          if (this.job === 'Lainnya') {
            request.job = this.formData.otherJob;
          }

          if (request.job.trim() === '') {
            this.errors.job = 'Pekerjaan tidak boleh kosong';
            return;
          }

          try {
            await this.register(request);
            this.$notify(
              'success',
              this.$t('alert.success'),
              this.$t('user.register-success-message'),
              {
                duration: 3000,
                permanent: false,
              }
            );
            this.$router.push({
              name: 'Login',
            });
          } catch (err) {
            if (err.response.status == 422) {
              this.markInvalids(err.response.data);
            }
            this.$notify(
              'error',
              this.$t('alert.success'),
              err.response.data.message ?? this.$t('user.register-error-message'),
              {
                duration: 3000,
                permanent: false,
              }
            );
          }
      },
      markInvalids(invalids) {
        this.resetInvalid();
        for (const invalidField in invalids.errors) {
          this.errors[invalidField] = invalids.errors[invalidField][0];
        }
      },
      resetInvalid() {
        for (const key in this.errors) {
          this.errors[key] = '';
        }
      },
      ...mapActions(['register']),
    },
    computed: {
      ...mapGetters(['processing']),
    },
  };
</script>

<style scoped>
  .login-bt {
    font-size: 14px !important;
  }
</style>
