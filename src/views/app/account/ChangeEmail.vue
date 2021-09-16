<template>
  <div class="change-password">
    <b-row>
      <b-col :md="6" class="mx-auto">
        <form @submit.prevent="updateUserEmail">
          <b-form-group
            :label="$t('pages.account.change-email.old-email')"
            class="has-float-label mb-4"
          >
            <b-form-input type="text" :value="currentUser.email" disabled />
          </b-form-group>
          <ValidationInput
            class="mb-3"
            field-name="email"
            :label="$t('pages.account.change-email.new-email')"
            v-model="form.email"
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
              {{ $t('pages.account.change-email.save-btn') }}
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
      processing: false,
      form: {
        email: '',
      },
      errors: {
        email: '',
      },
    }),
    methods: {
      async updateUserEmail() {
        try {
          this.resetInvalid();
          this.processing = true;
          await this.updateUserInfo({
            userId: this.currentUser.id,
            data: {
              email: this.form.email,
            },
          });
          Notify.success('Berhasil mengupdate email');
          this.form.email = '';
        } catch (err) {
          this.checkForInvalidResponse(err);
        } finally {
          this.processing = false;
        }
      },
      ...mapActions(['fetchUserInfo', 'updateUserInfo']),
    },
    computed: {
      ...mapGetters(['currentUser']),
    },
    components: {
      ValidationInput,
    },
  };
</script>
