<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <p class="text-white h2">
            {{ $t('dashboards.magic-is-in-the-details') }}
          </p>
          <p class="white mb-0">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus,
            similique!
          </p>
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
          <h6>{{ $t('user.reset-password-title') }}</h6>
          <p class="mb-4">{{ $t('user.reset-password-instruction') }}</p>
          <b-form
            @submit.prevent="formSubmit"
            class="av-tooltip tooltip-label-bottom"
          >
            <b-form-group
              :label="$t('user.password')"
              class="has-float-label mb-4"
            >
              <b-form-input
                type="password"
                v-model="$v.form.password.$model"
                :state="!$v.form.password.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.password.required"
                >Please enter your password</b-form-invalid-feedback
              >
              <b-form-invalid-feedback
                v-else-if="
                  !$v.form.password.minLength || !$v.form.password.maxLength
                "
                >Your password must be between 4 and 16
                characters</b-form-invalid-feedback
              >
            </b-form-group>
            <b-form-group
              :label="$t('user.password-again')"
              class="has-float-label mb-4"
            >
              <b-form-input
                type="password"
                v-model="$v.form.passwordAgain.$model"
                :state="!$v.form.passwordAgain.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.passwordAgain.required"
                >Please enter your password again</b-form-invalid-feedback
              >
              <b-form-invalid-feedback
                v-else-if="!$v.form.passwordAgain.sameAsPassword"
                >Your inputs does not match</b-form-invalid-feedback
              >
            </b-form-group>

            <div class="d-flex justify-content-end">
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
  const {
    required,
    maxLength,
    minLength,
    email,
    sameAs,
  } = require('vuelidate/lib/validators');

  export default {
    data() {
      return {
        form: {
          password: '',
          passwordAgain: '',
        },
      };
    },
    mixins: [validationMixin],
    validations: {
      form: {
        password: {
          required,
          minLength: minLength(6),
        },
        passwordAgain: {
          required,
          sameAsPassword: sameAs('password'),
        },
      },
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'processing',
        'loginError',
        'resetPasswordSuccess',
      ]),
    },
    methods: {
      ...mapActions(['resetPassword']),
      async formSubmit() {
        try {
          this.$v.form.$touch();
          if (!this.$v.form.$anyError) {
            await this.resetPassword({
              token: this.$route.query.token,
              password: this.form.password,
              passwordConfirmation: this.form.passwordAgain || '',
            });
            this.$router.replace({ name: 'Login' });
          }
        } catch (err) {
          this.$notify(
            'error',
            this.$t('alert.success'),
            this.$t('user.reset-password-error-msg'),
            {
              duration: 3000,
              permanent: false,
            }
          );
        }
      },
    },
    watch: {
      loginError(val) {
        if (val != null) {
          this.$notify('error', 'Reset Password Error', val, {
            duration: 3000,
            permanent: false,
          });
        }
      },
      resetPasswordSuccess(val) {
        if (val) {
          this.$notify(
            'success',
            'Reset Password Success',
            'Reset password success',
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
