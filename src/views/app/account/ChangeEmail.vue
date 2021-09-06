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
          <div class="mb-4">
            <label class="form-group has-float-label mb-0">
              <input
                type="text"
                class="form-control"
                :class="{ 'border-danger': errors.email }"
                v-model="form.email"
              />
              <span :class="{ 'text-danger': errors.email }">
                {{ $t('pages.account.change-email.new-email') }}
              </span>
            </label>
            <span
              v-if="errors.email"
              for=""
              class="mt-1 d-block text-danger error-msg"
            >
              {{ errors.email }}
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
              {{ $t('pages.account.change-email.save-btn') }}
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
      ...mapActions(['fetchUserInfo', 'updateUserInfo']),
    },
    computed: {
      ...mapGetters(['currentUser']),
    },
  };
</script>
