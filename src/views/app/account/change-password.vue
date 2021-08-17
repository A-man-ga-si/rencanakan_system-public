<template>
  <div class="change-password">
    <b-row>
      <b-col :md="6" class="mx-auto">
        <form @submit.prevent="updatePassword">
          <div class="mb-4">
            <label class="form-group has-float-label mb-0">
              <input
                type="password"
                class="form-control"
                :class="{ 'border-danger': errors.old_password }"
                v-model="form.oldPassword"
              />
              <span :class="{ 'text-danger': errors.old_password }">
                {{ $t('pages.account.change-password.old-password') }}
              </span>
            </label>
            <span
              v-if="errors.old_password"
              for=""
              class="mt-1 d-block text-danger error-msg"
            >
              {{ errors.old_password }}
            </span>
          </div>
          <div class="mb-4">
            <label class="form-group has-float-label mb-0">
              <input
                type="password"
                class="form-control"
                :class="{ 'border-danger': errors.password }"
                v-model="form.password"
              />
              <span :class="{ 'text-danger': errors.password }">
                {{ $t('pages.account.change-password.new-password') }}
              </span>
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
                v-model="form.passwordConfirmation"
              />
              <span :class="{ 'text-danger': errors.password_confirmation }">
                {{ $t('pages.account.change-password.confirm-new-password') }}
              </span>
            </label>
            <span
              v-if="errors.password_confirmation"
              for=""
              class="mt-1 d-block text-danger error-msg"
            >
              {{ errors.password_confirmation }}
            </span>
          </div>
          <b-btn
            type="submit"
            variant="primary"
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
              {{ $t('pages.account.change-password.save-btn') }}
            </span>
          </b-btn>
        </form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { Notify } from 'notiflix';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    data: () => ({
      errors: {
        old_password: '',
        password: '',
        password_confirmation: '',
      },
      form: {
        oldPassword: '',
        password: '',
        passwordConfirmation: '',
      },
      processing: false,
    }),
    computed: {
      ...mapGetters(['currentUser']),
    },
    methods: {
      async updatePassword() {
        try {
          this.resetInvalid();
          this.processing = true;
          await this.updateUserInfo({
            userId: this.currentUser.id,
            data: {
              old_password: this.form.oldPassword,
              password: this.form.password,
              password_confirmation: this.form.passwordConfirmation,
            },
          });
          Notify.success('Berhasil mengupdate kata sandi');
        } catch (err) {
          switch (err.response?.status) {
            case 422:
              this.markInvalids(err.response.data);
              break;
            default:
              Notify.failure('Gagal mengupdate email');
              console.error(err);
              break;
          }
        } finally {
          this.processing = false;
          this.form = {
            password: '',
            oldPassword: '',
            passwordConfirmation: '',
          };
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
      ...mapActions(['updateUserInfo']),
    },
  };
</script>
