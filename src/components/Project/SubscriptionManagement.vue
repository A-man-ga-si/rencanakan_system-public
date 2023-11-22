<template>
  <b-modal :id="modalId" :ref="modalId" title="Management Paket Project">
    <div class="info-group mb-3">
      <p class="font-weight-bold mb-0" style="font-size: 16px;">Nama Project</p>
      <p class="mb-0">{{ project.name }}</p>
    </div>
    <div class="info-group mb-3">
      <p class="font-weight-bold mb-0" style="font-size: 16px;">Paket Langganan</p>
      <p class="mb-0">{{ project.subscription_id ? project.subscription_id.toUpperCase() : '' }}</p>
    </div>
    <div class="info-group mb-3">
      <p class="font-weight-bold mb-0" style="font-size: 16px;">Harga Perpanjangan</p>
      <p class="mb-0">{{ project.subscription ? project.subscription.formattedPrice : '' }}</p>
    </div>
    <div class="info-group mb-3">
      <p class="font-weight-bold mb-0" style="font-size: 16px;">Tanggal Kadaluwarsa</p>
      <p class="mb-0">{{ project.order.expired_at }}</p>
    </div>
    <div class="info-group mb-3">
      <p class="font-weight-bold mb-0" style="font-size: 16px;">Status</p>
      <p class="mb-0" :class="{'text-danger': project.order.is_expired, 'text-success': !project.order.is_expired}">{{ project.order.is_expired ? 'Kadaluwarsa' : 'Aktif' }}</p>
    </div>
    <span class="d-inline-block mt-2"><PhInfo /> Tanggal expired paket berlaku akumulasi ketika anda memperpanjang paket</span>
    <template #modal-footer>
        <b-button @click="packageRenewal" variant="success">Perpanjang Paket</b-button>
        <b-button v-b-modal.subscription-comparison-modal-upgrade variant="primary">Upgrade Paket</b-button>
        <b-button @click="$bvModal.hide(modalId)" variant="secondary">Tutup</b-button>
      </template>
  </b-modal>
</template>

<script>

import { formatCurrency } from '@/utils';
import { Notify } from 'notiflix';
import { PhStar, PhInfo } from 'phosphor-vue'
import { mapActions, mapGetters } from 'vuex'
import { showConfirmAlert } from '@/utils';

export default {
  data() {
    return {
      modalId: 'manage-project-subscription',
      project: {
        order: {},
      },
    }
  },
  props: {
    projectData: Object,
  },
  computed: {
    ...mapGetters(['getSubscriptions', 'currentUser']),
    withoutDemoOnly() {
      return this.getSubscriptions.filter(subscription => subscription.is_show).map(subscription => {
        subscription.price = formatCurrency(subscription.price)
        return subscription
      })
    },
  },
  watch: {
    projectData() {
      this.project = this.projectData
      if (this.project.subscription) {
        this.project.subscription.formattedPrice = this.project.subscription_id == 'demo' ? 'Anda hanya dapat meng-upgrade paket demo' : formatCurrency(this.project.subscription.price)
      }
    }
  },
  methods: {
    ...mapActions(['fetchSubscriptionSnapToken', 'renewSubscription', 'setCanceled']),
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    async packageRenewal() {
      if (this.project.subscription_id == 'demo') {
        Notify.failure('Paket demo tidak dapat diperpanjang! Harap upgrade paket untuk tetap mengaktifkan project')
      } else {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Perpanjang Paket Project ?',
          text: 'Tanggal expired project anda akan diperpanjang hingga 2023-02-01 !',
          icon: 'question'
        });
        if (isConfirmed) {
          const data = await this.fetchSubscriptionSnapToken({
            subscription_id: this.project.subscription_id,
            project_hashid: this.projectData.hashid,
            type: 'renew',
          })
  
          if (data.status != 200) {
            throw new Error(data.message)
          }

          const snapToken = data.data.data.snap_token
  
          const that = this

          window.snap.pay(snapToken, {
              onSuccess: async () => {

                // Call renew subscription API
                // this.renewSubscription()
  
                  // await that.createProject(this.form);

                  that.$emit('project-renewed');
                  that.hideModal(that.modalId);

                  Notify.success('Berhasil memperpanjang paket project');
              },
              async onPending() {
                  await that.setPending({
                  snapToken
                  })
              },
              onError() {
                  Notify.failure('Tidak dapat melanjutkan pembayaran. Hubungi CS untuk informasi lebih lanjut');
              },
              onClose() {
                  Notify.failure('Perpanjangan paket proyek tidak dapat dilanjutkan karena pembayaran telah dibatalkan.');
                  that.setCanceled({
                    snapToken
                  })
                  // Delete order
              },
              skipOrderSummary: false,
          });
        }
      }
    }
  },
  components: {
    PhStar,
    PhInfo
  }
}
</script>

<style scoped>
</style>