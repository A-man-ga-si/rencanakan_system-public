<template>
  <div id="root">
    <div class="fixed-background">
      <main>
        <div class="container">
          <b-row class="h-100">
            <b-colxx xxs="12" md="10" class="mx-auto my-auto">
              <b-card class="auth-card" no-body>
                <div class="position-relative image-side">
                  <p class="text-white h2">ERROR</p>
                  <p class="white mb-0">
                    This page is either of unexist, not-accessible for your
                    role, or under development !
                  </p>
                </div>
                <div class="form-side">
                  <router-link to="/">
                    <img
                      src="@/assets/logos/rencanakan-logo-min.png"
                      alt=""
                      style="width: 100%; max-width: 190px"
                      class="mb-3"
                    />
                  </router-link>
                  <h6 class="mb-4">{{ $t('pages.error-title') }}</h6>
                  <p class="mb-0 text-muted text-small mb-0">
                    {{ $t('pages.error-code') }}
                  </p>
                  <p class="display-1 font-weight-bold mb-5">{{ errorCode }}</p>
                  <b-button
                    type="submit"
                    variant="primary"
                    size="lg"
                    class="btn-shadow"
                    @click="goBack"
                    >{{ $t('pages.go-back-home') }}</b-button
                  >
                </div>
              </b-card>
            </b-colxx>
          </b-row>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
  import { adminRoot, availableErrorCodes } from '../constants/config';

  export default {
    data() {
      return {
        availableErrorCodes,
      };
    },
    methods: {
      goBack() {
        this.$router.push(adminRoot);
      },
    },
    computed: {
      errorCode() {
        const paramsErrorCode = this.$route.params.errorCode;
        return availableErrorCodes.includes(paramsErrorCode)
          ? paramsErrorCode
          : 404;
      },
    },
    mounted: function () {
      document.body.classList.add('background');
    },
    beforeDestroy() {
      document.body.classList.remove('background');
    },
  };
</script>
