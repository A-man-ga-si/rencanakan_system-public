<template>
  <div class="change-password">
    <b-row>
      <b-col :md="6" class="mx-auto">
        <b-form-group
          :label="$t('pages.account.change-password.old-password')"
          class="has-float-label mb-4"
        >
          <b-form-input type="text" />
        </b-form-group>
        <b-form-group
          :label="$t('pages.account.change-password.new-password')"
          class="has-float-label mb-4"
        >
          <b-form-input type="text" />
        </b-form-group>
        <b-form-group
          :label="$t('pages.account.change-password.confirm-new-password')"
          class="has-float-label mb-4"
        >
          <b-form-input type="text" />
        </b-form-group>
        <b-btn variant="primary">
          {{ $t('pages.account.change-password.save-btn') }}
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>
