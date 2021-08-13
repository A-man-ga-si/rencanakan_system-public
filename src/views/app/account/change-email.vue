<template>
  <div class="change-password">
    <b-row>
      <b-col :md="6" class="mx-auto">
        <b-form-group
          :label="$t('pages.account.change-email.old-email')"
          class="has-float-label mb-4"
        >
          <b-form-input
            type="text"
            value="asfafa"
            v-model="form.email"
            disabled
          />
        </b-form-group>
        <b-form-group
          :label="$t('pages.account.change-email.new-email')"
          class="has-float-label mb-4"
        >
          <b-form-input type="text" value="asfafa" />
        </b-form-group>
        <b-btn variant="primary">{{
          $t('pages.account.change-email.save-btn')
        }}</b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data: () => ({
      form: {
        email: '',
      },
    }),
    created() {
      this.fetchCurrentUserInfo();
    },
    methods: {
      // TODO: Make current user data reusable !
      async fetchCurrentUserInfo() {
        try {
          const { data } = await this.fetchUserInfo(this.currentUser.id);
          const { email } = data.data.user;
          this.form.email = email;
          this.formDisabled = false;
        } catch (err) {
          console.error(err);
        }
      },
      ...mapActions(['fetchUserInfo']),
    },
    computed: {
      ...mapGetters(['currentUser']),
    },
  };
</script>
