<template>
  <div class="company-profile">
    <div class="text-center">
      <b-img
        src="./../../../assets/img/panel/construction.png"
        fluid
        class="d-block no-company-profile-img mx-auto"
      >
      </b-img>
      <h5 class="mt-4 mb-3 font-weight-bold">
        {{ $t('pages.account.company-profile.no-company-profile-msg') }}
      </h5>
      <b-btn variant="primary">{{
        $t('pages.account.company-profile.add-company-profile-bt')
      }}</b-btn>
    </div>
  </div>
</template>

<style scoped>
  .no-company-profile-img {
    max-width: 350px;
  }
</style>
