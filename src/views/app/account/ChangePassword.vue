<template>
  <div class="change-password">
    <b-row>
      <b-col :md="6" class="mx-auto">
        <form @submit.prevent="updatePassword">
          <ValidationInput
            type="password"
            class="mb-4"
            v-model="form.oldPassword"
            :label="$t('pages.account.change-password.old-password')"
            field-name="old_password"
          />
          <ValidationInput
            type="password"
            class="mb-4"
            v-model="form.password"
            :label="$t('pages.account.change-password.new-password')"
            field-name="password"
          />
          <ValidationInput
            type="password"
            class="mb-4"
            v-model="form.passwordConfirmation"
            :label="$t('pages.account.change-password.confirm-new-password')"
            field-name="password_confirmation"
          />
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
  import ValidationInput from './../../../components/Common/ValidationInput.vue';
  import validationMixin from './../../../mixins/validation-mixins';
  import { Notify } from 'notiflix';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    mixins: [validationMixin],
    data: () => ({
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
          this.checkForInvalidResponse(err);
        } finally {
          this.processing = false;
          this.resetForm();
        }
      },
      resetForm() {
        this.form = {
          password: '',
          oldPassword: '',
          passwordConfirmation: '',
        };
      },
      ...mapActions(['updateUserInfo']),
    },
    components: {
      ValidationInput,
    },
  };
</script>
