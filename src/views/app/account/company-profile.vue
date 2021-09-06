<template>
  <div class="company-profile">
    <div class="companies-list" v-if="getCompanies.length">
      <div class="text-right">
        <b-btn v-b-modal.add-company variant="primary">
          {{ $t('pages.account.company-profile.add-company-profile-bt') }}
        </b-btn>
      </div>
      <b-row class="mt-4">
        <b-col
          v-for="(company, idx) in getCompanies"
          :key="idx"
          :lg="6"
          class="mb-3"
        >
          <CompanyProfileItem :company="company" />
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
  import { mapActions, mapGetters } from 'vuex';
  import AddCompanyProfile from './../../../components/Account/CompanyProfile/AddCompanyProfile.vue';
  import CompanyProfileItem from './../../../components/Account/CompanyProfile/CompanyProfileItem.vue';

  export default {
    computed: {
      ...mapGetters(['getCompanies']),
    },
    components: {
      AddCompanyProfile,
      CompanyProfileItem,
    },
  };
</script>

<style scoped>
  .no-company-profile-img {
    max-width: 350px;
  }
</style>
