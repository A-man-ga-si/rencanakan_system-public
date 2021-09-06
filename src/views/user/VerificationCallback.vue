<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <div class="dark-overlay" style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,0.6)"></div>
          <div class="trans-overlay position-relative" style="z-index: 9;">
            <p class="text-white h2">
              {{ $t('dashboards.login-string-title') }}
            </p>
            <p class="white mb-0">
              Rencanakan.Id adalah aplikasi yang memudahkan kontraktor kecil dalam
              membuat RAB dengan harga yang sangat terjangkau.
              <br>
                Fitur :
              <ul>
                <li>RAB Generated Excel</li>
                <li>Management project (coming soon)</li>
                <li>Group project (coming soon) </li>
              </ul>
            </p>
          </div>
        </div>
        <div class="form-side">
          <router-link to="/">
            <b-img
              src="./../../assets/logos/rencanakan-logo-min.png"
              style="max-width: 250px"
              class="mb-5"
              fluid
            ></b-img>
            <!-- <span class="logo-single" /> -->
          </router-link>
          <h6 class="mb-4">{{ $t('user.email-verify-title') }}</h6>
          <div class="text-center" v-if="status === 'success'">
            <i class="iconminds simple-icon-check success-ic text-primary"></i>
            <h3 class="my-4">{{ $t('user.email-verified-ok-message') }}</h3>
            <b-btn @click.prevent="replaceTo('Login')" variant="primary">{{ $t('user.back-to-login') }}</b-btn>
          </div>
          <div class="text-center" v-else>
            <i class="iconminds simple-icon-close success-ic text-danger"></i>
            <h3 class="my-4">{{ $t('user.email-verified-fail-message') }}</h3>
            <b-btn @click.prevent="replaceTo('Register')" variant="primary">{{ $t('user.back-to-register') }}</b-btn>
          </div>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
export default {
    data() {
        return {
            ...this.$route.query,
        }
    },
    mounted() {
        console.log(this.status);
    },
    methods: {
        replaceTo(target) {
            this.$router.replace({name: target});
        }
    }
}
</script>

<style scoped>
  .register-bt {
    font-size: 14px !important;
  }
  
  .success-ic {
      font-size: 70px;
  }
</style>
