<template>
  <div class="project-rab">
    <b-row>
      <b-colxx xxs="12">
        <b-row>
          <b-col :sm="9">
            <piaf-breadcrumb :heading="$t('menu.rab')" />
          </b-col>
          <b-col :sm="3" class="text-right">
            <b-btn
              variant="primary"
              @click.prevent="didExportRabButtonClicked"
            >
              {{ $t('pages.projects.rab.summary.export-btn') }}
            </b-btn>
          </b-col>
        </b-row>
        <div class="separator mb-5"></div>
        <b-alert variant="primary" show class="rounded">
          <i class="iconminds simple-icon-info mr-2"></i>
          <b>Perhatian : </b>Gunakan titik (.) sebagai pengganti koma
        </b-alert>
      </b-colxx>
    </b-row>
    <b-row>
      <b-col>
        <b-card>
          <b-nav pills>
            <b-nav-item :to="{ name: 'RabSummary' }">
              {{ $t('pages.projects.rab.rab-tab') }}
            </b-nav-item>
            <b-nav-item :to="{ name: 'RabAhs' }">
              {{ $t('pages.projects.rab.ahs-tab') }}
            </b-nav-item>
            <b-nav-item :to="{ name: 'ItemPrice' }">
              {{ $t('pages.projects.rab.unit-tab') }}
            </b-nav-item>
            <b-nav-item :to="{ name: 'RabAhp' }">
              {{ $t('pages.projects.rab.tools-price-tab') }}
            </b-nav-item>
            <b-nav-item :to="{ name: 'RabImplementationSchedule' }">
              {{ $t('pages.projects.rab.implementation-schedule-tab') }}
            </b-nav-item>
            <b-nav-item :to="{ name: 'MaterialEstimator' }">
              Hitung Bahan
            </b-nav-item>
          </b-nav>
          <router-view />
        </b-card>
      </b-col>
    </b-row>
    <ExportRab />
    <export-rab-restriction-modal @on-click-upgrade-button="didUpgradeButtonClicked"/>
    <subscription-comparison
      modal-id="subscription-comparison-modal-upgrade"
      @choose-subscription="didSubscriptionChoosen"
    />
  </div>
</template>

<script>
  import ExportRab from '@/components/Project/ExportRab.vue';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { Notify } from 'notiflix';
  import { ExportRabRestrictionModal } from './components';
  import SubscriptionComparison from '@/components/Project/SubscriptionComparison.vue';
  import { showConfirmAlertWithPreloader } from '@/utils';
  import midtransMixin from '@/mixins/midtrans-mixin'

  export default {
    mixins: [midtransMixin],
    data: {
      currentProject: null
    },
    methods: {
      ...mapActions([
        // Project Services
        'showProject',

        // Subscription Services
        'fetchSubscriptions',
        'fetchSubscriptionSnapToken',
        'setCanceled',
        'setPending'
      ]),
      ...mapMutations(['setCurrentActiveProject']),
      async loadProjectData() {
        const data = await this.showProject(this.$route.params.id)
        if (data.data.data.project.activeOrder && !data.data.data.project.activeOrder.is_expired) {
          await this.setCurrentActiveProject(data.data.data.project);
          this.currentProject = data.data.data.project;
          return;
        }
        Notify.failure('Project telah kadaluwarsa, anda tidak dapat mengakses halaman ini!');
        this.$router.replace({ name: 'Project' })
      },
      didExportRabButtonClicked() {
        if (this.currentProject.subscription_id != 'demo') {
          this.$bvModal.show('export-rab');
          return;
        }
        this.fetchSubscriptions();
        this.$bvModal.show('export-rab-restriction');
      },
      didUpgradeButtonClicked() {
        this.$bvModal.show('subscription-comparison-modal-upgrade');
      },
      async didSubscriptionChoosen(subscriptionId) {
        const parentView = this;
        await showConfirmAlertWithPreloader ({
          title: 'Ganti paket?',
          text: 'Paket yang Anda miliki saat ini akan digantikan oleh paket yang telah Anda pilih.',
          icon: 'question',
          preConfirm: async () => {
            const data = await this.fetchSubscriptionSnapToken({
              project_hashid: this.$route.params.id,
              subscription_id: subscriptionId,
              type: 'renew',
            })
            if (data.status != 200) {
              throw new Error(data.message)
            }
            const snapToken = data.data.data.snap_token
            await new Promise((resolve, _) => {
              window.snap.pay(snapToken, {
                skipOrderSummary: false,
                onSuccess: async () => {
                  Notify.success('Berhasil upgrade project');
                  parentView.$bvModal.hide('subscription-comparison-modal-upgrade')
                  this.loadProjectData();
                  resolve()
                },
                async onPending() {
                  await parentView.setPending({snapToken})
                  resolve()
                },
                onError() {
                    Notify.failure('Tidak dapat melanjutkan pembayaran. Hubungi CS untuk informasi lebih lanjut');
                    resolve()
                },
                onClose() {
                    Notify.failure('Upgrading paket tidak dapat dilanjutkan karena pembayaran telah dibatalkan.');
                    parentView.$bvModal.hide('subscription-comparison-modal-upgrade')
                    parentView.setCanceled({ snapToken })
                    resolve()
                },
              });
            })
          }
        })
      }
    },
    async created() {
      await this.loadProjectData();
    },
    components: {
      ExportRab,
      ExportRabRestrictionModal,
      SubscriptionComparison
    },
  };
</script>

<style>
  .rab-card-single .heading,
  .ahs-card-single .heading,
  .item-price-card-single .heading {
    /* border-bottom: 1px solid #ddd; */
    padding-bottom: 7px;
  }
</style>
