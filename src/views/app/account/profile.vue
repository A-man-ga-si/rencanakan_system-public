<template>
  <div class="profile">
    <b-row>
      <b-col :md="6" class="mx-auto">
        <div class="text-center">
          <b-img :src="profileImage" alt="" fluid class="profile-img" />
          <input type="file" id="profile-photo-input" class="d-none" />
          <a
            class="d-block mt-3 change-foto text-link text-primary"
            href="#"
            @click.prevent="changePhoto"
          >
            {{ $t('pages.account.profile.change-photo') }}
          </a>
        </div>
        <div class="form-section mt-4">
          <form>
            <b-form-group
              :label="$t('pages.account.profile.first-name')"
              class="has-float-label mb-4"
            >
              <b-form-input type="text" v-model="form.firstName" />
            </b-form-group>
            <b-form-group
              :label="$t('pages.account.profile.last-name')"
              class="has-float-label mb-4"
            >
              <b-form-input type="text" v-model="form.lastName" />
            </b-form-group>
            <b-form-group
              :label="$t('pages.account.profile.phone')"
              class="has-float-label mb-4"
            >
              <b-form-input type="text" v-model="form.phone" />
            </b-form-group>
            <b-form-group
              :label="$t('pages.account.profile.job')"
              class="has-float-label mb-4"
            >
              <b-form-input type="text" v-model="form.job" />
            </b-form-group>
            <b-btn variant="primary" class="mx-auto">
              {{ $t('pages.account.profile.save-btn') }}
            </b-btn>
          </form>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { apiDomain } from './../../../constants/config';

  export default {
    data: () => ({
      formDisabled: true,
      form: {
        firstName: '',
        lastName: '',
        phone: '',
        job: '',
      },
    }),
    created() {
      // TODO: Make current user data reusable !
      this.fetchCurrentUserInfo();
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
      ...mapActions(['fetchUserInfo']),
      changePhoto() {
        const fileInput = document.querySelector('#profile-photo-input');
        fileInput.click();
      },
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
