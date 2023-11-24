<template>
  <b-modal :id="modalId" :ref="modalId" title="Bandingkan Paket" size="lg">
    <b-row>
      <b-col v-for="(subscription, i) in withoutDemoOnly" :key="i" lg="6" class="mb-3">
        <b-card>
          <b-card-title class="text-center">
            <PhStar class="text-primary subscription-icon" />
            <h5><strong>{{ subscription.name }}</strong></h5>
          </b-card-title>
          <b-card-body class="pt-2" v-html="subscription.description"></b-card-body>
          <div class="text-center">
            <h5 class="mb-3" v-if="subscription.promotion_price" style="text-decoration: line-through;">Rp. {{ subscription.formatted_promotion_price }}/{{ subscription.subscription_type == 'MONTHLY' ? 'bulan' : (subscription.subscription_type == 'DAILY' ? 'hari' : (subscription.subscription_type == 'QUARTERLY' ? '3 bulan' : 'tahun')) }}</h5>
            <h5 class="mb-3">Rp. {{ subscription.formatted_price }}/{{ subscription.subscription_type == 'MONTHLY' ? 'bulan' : (subscription.subscription_type == 'DAILY' ? 'hari' : (subscription.subscription_type == 'QUARTERLY' ? '3 bulan' : 'tahun')) }}</h5>
            <b-button @click="onChooseSubscription(subscription.id)" variant="primary" type="button">Pilih Paket</b-button>
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
import { PhStar } from 'phosphor-vue'
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
    PhStar
  }
}
</script>

<style scoped>
.subscription-icon {
  font-size: 35px;
  margin-bottom: 10px;
}
</style>