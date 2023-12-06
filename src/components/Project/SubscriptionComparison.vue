<template>
  <b-modal :id="modalId" :ref="modalId" title="Bandingkan Paket" size="lg">
    <b-row>
      <b-col v-for="(subscription, i) in withoutDemoOnly" :key="i" lg="6" class="mb-3">
        <b-card>
          <b-card-title class="text-center">
            <PhPackage class="text-primary subscription-icon" />
            <h3><strong>{{ subscription.name }}</strong></h3>
          </b-card-title>
          <b-card-body class="pt-2" v-html="subscription.description"></b-card-body>
          <div class="text-center">
            <h5 class="promo-text" v-if="subscription.promotion_price" style="text-decoration: line-through;">Rp. {{ subscription.formatted_promotion_price }}/{{ subscription.subscription_type == 'MONTHLY' ? 'bulan' : (subscription.subscription_type == 'DAILY' ? 'hari' : (subscription.subscription_type == 'QUARTERLY' ? '3 bulan' : 'tahun')) }}</h5>
            <h5 class="font-weight-bold">Rp. {{ subscription.formatted_price }}/{{ subscription.subscription_type == 'MONTHLY' ? 'bulan' : (subscription.subscription_type == 'DAILY' ? 'hari' : (subscription.subscription_type == 'QUARTERLY' ? '3 bulan' : 'tahun')) }}</h5>
            <span class="d-block blinking-text"><span class="text-danger">*</span> Penawaran Terbatas</span>
            <b-button @click="onChooseSubscription(subscription.id)" variant="primary" type="button" class="mt-3">Pilih Paket</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <template #modal-footer>
        <b-button @click="$bvModal.hide(modalId)" variant="secondary">Tutup</b-button>
      </template>
  </b-modal>
</template>

<script>

import { formatCurrency } from '@/utils';
import { Notify } from 'notiflix';
import { PhStar, PhPackage } from 'phosphor-vue'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // modalId: '',
    }
  },
  props: ['modalId'],
  computed: {
    ...mapGetters(['getSubscriptions', 'currentUser']),
    withoutDemoOnly() {
      return this.getSubscriptions.filter(subscription => subscription.is_show == '1').map(subscription => {
        subscription.formatted_price = formatCurrency(Number(subscription.price))
        subscription.formatted_promotion_price = subscription.promotion_price ? formatCurrency(Number(subscription.promotion_price)) : ''
        return subscription
      })
    },
  },
  methods: {
    onChooseSubscription(subscriptionId) {
      if (this.currentUser.demo_quota > 0) {
          Notify.failure(`Tidak dapat memilih paket, anda masih memliki kuota demo project ${this.currentUser.demo_quota} kali. Gunakan kuota demo untuk membuat project terlebih dahulu`);
        } else {
          this.$emit('choose-subscription', subscriptionId)
        }
    }
  },
  components: {
    PhStar,
    PhPackage
  }
}
</script>

<style scoped>
.subscription-icon {
  font-size: 45px;
  margin-bottom: 15px;
}

.blinking-text {
  animation: blinker .7s linear infinite;
}

.promo-text {
  font-size: 15px;
}

ul {
  padding-left: 0;
}

@keyframes blinker {
  50% {
    opacity: .1;
  }
}
</style>