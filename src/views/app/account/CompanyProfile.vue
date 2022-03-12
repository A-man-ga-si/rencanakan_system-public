<template>
  <div class="company-profile">
    <div class="companies-list" v-if="getCompany">
      <b-row>
        <b-col class="mx-auto" :md="8" :xl="5">
          <EditCompanyProfile />
        </b-col>
      </b-row>
    </div>
    <div class="text-center" v-else>
      <b-img
        src="./../../../assets/img/panel/construction.png"
        fluid
        class="d-block no-company-profile-img mx-auto"
      >
      </b-img>
      <h5 class="mt-4 mb-3 font-weight-bold">
        {{ $t('pages.account.company-profile.no-company-profile-msg') }}
      </h5>
      <b-btn v-b-modal.add-company variant="primary">
        {{ $t('pages.account.company-profile.add-company-profile-bt') }}
      </b-btn>
    </div>
    <AddCompanyProfile />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import AddCompanyProfile from '@/components/Account/CompanyProfile/AddCompanyProfile.vue';
  import EditCompanyProfile from '@/components/Account/CompanyProfile/EditCompanyProfile.vue';

  export default {
    computed: {
      ...mapGetters(['getCompany']),
    },
    components: {
      AddCompanyProfile,
      EditCompanyProfile,
    },
  };
</script>

<style scoped>
  .no-company-profile-img {
    max-width: 350px;
  }
</style>
