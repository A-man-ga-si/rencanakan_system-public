<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <div class="dark-overlay"></div>
          <div style="z-index: 1" class="trans-overlay position-relative">
            <p class="text-white h2">
              {{ $t('dashboards.magic-is-in-the-details') }}
            </p>
            <p class="white mb-0">
              Masukkan E-Mail anda untuk melakukan reset kata sandi
              <br />Jika anda belum mempunyai akun, silahkan
              <router-link to="/auth/register" class="white"
                ><u>daftar</u></router-link
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
          <h6 class="mb-4">{{ $t('user.forgot-password') }}</h6>
          <b-form
            @submit.prevent="formSubmit"
            class="av-tooltip tooltip-label-bottom"
          >
            <b-form-group
              :label="$t('user.email')"
              class="has-float-label mb-4"
            >
              <b-form-input
                type="text"
                v-model="$v.form.email.$model"
                :state="!$v.form.email.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.email.required"
                >Please enter your email address</b-form-invalid-feedback
              >
              <b-form-invalid-feedback v-else-if="!$v.form.email.email"
                >Please enter a valid email address</b-form-invalid-feedback
              >
              <b-form-invalid-feedback v-else-if="!$v.form.email.minLength"
                >Your email must be minimum 4
                characters</b-form-invalid-feedback
              >
            </b-form-group>
            <div class="d-flex justify-content-between align-items-center">
              <router-link :to="{ name: 'Login' }">{{
                $t('user.already-have-account')
              }}</router-link>
              <b-button
                type="submit"
                variant="primary"
                size="lg"
                :disabled="processing"
                :class="{
                  'btn-multiple-state btn-shadow': true,
                  'show-spinner': processing,
                  'show-success': !processing && loginError === false,
                  'show-fail': !processing && loginError,
                }"
              >
                <span class="spinner d-inline-block">
                  <span class="bounce1"></span>
                  <span class="bounce2"></span>
                  <span class="bounce3"></span>
                </span>
                <span class="icon success">
                  <i class="simple-icon-check"></i>
                </span>
                <span class="icon fail">
                  <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">{{
                  $t('user.reset-password-button')
                }}</span>
              </b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { validationMixin } from 'vuelidate';
  import Swal from 'sweetalert2';
  const {
    required,
    maxLength,
    minLength,
    email,
  } = require('vuelidate/lib/validators');

  export default {
    data() {
      return {
        form: {
          email: '',
        },
      };
    },
    mixins: [validationMixin],
    validations: {
      form: {
        email: {
          required,
          email,
          minLength: minLength(4),
        },
      },
    },
    computed: {
      ...mapGetters(['processing', 'loginError', 'forgotMailSuccess']),
    },
    methods: {
      ...mapActions(['forgotPassword']),
      async formSubmit() {
        this.$v.form.$touch();
        if (!this.$v.form.$anyError) {
          await this.forgotPassword({
            email: this.form.email,
          });
          this.$router.replace({ name: 'Login' });
        }
      },
    },
    watch: {
      forgotMailSuccess(val) {
        if (val) {
          this.$notify(
            'success',
            'Forgot Password Success',
            'We have sent you a confirmation mail if your E-Mail registered',
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
