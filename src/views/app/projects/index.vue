<template>
  <div>
    <b-row class="mb-3">
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Proyek" />
        <div class="separator"></div>
      </b-colxx>
    </b-row>
    <a href="#" v-if="!getCompany">
      <b-alert show variant="danger" class="rounded">
        {{ $t('alert.email-no-active-company') }}
      </b-alert>
    </a>
    <b-alert v-if="currentUser.demo_quota > 0" show variant="success" class="rounded">
      Anda memiliki {{ currentUser.demo_quota }} kuota demo untuk membuat proyek.
    </b-alert>
    <b-row class="mt-4">
      <b-colxx xxs="12">
        <ProjectItem
          ref="project-item"
          @edit-project-clicked="setEditedProject"
          @manage-project-subscription-button-clicked="manageProjectSubscription"
        />
      </b-colxx>
    </b-row>
    <AddProject ref="add-project-modal-ref" data-title="Farewell!" data-intro="And this is the last step!" @project-added="onProjectAdded" :provinces="getProvinces" />
    <EditProject
      @project-edited="reload"
      :provinces="getProvinces"
      :selected-project="selectedProject"
    />
    <SubscriptionComparison modal-id="subscription-comparison-modal-new" @choose-subscription="chooseSubscription" />
    <SubscriptionComparison modal-id="subscription-comparison-modal-upgrade" @choose-subscription="upgradeSubscription" />
    <SubscriptionManagement :project-data="selectedManageSubscriptionProject" @project-renewed="reload" />
  </div>
</template>

<script>
  import AppLayout from './../../../layouts/AppLayout.vue';
  import AddProject from './../../../components/Project/AddProject.vue';
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';
  import ProjectItem from '@/components/Project/ProjectItem.vue';
  import EditProject from '@/components/Project/EditProject.vue';
  import SubscriptionComparison from '@/components/Project/SubscriptionComparison.vue'
  import SubscriptionManagement from '@/components/Project/SubscriptionManagement.vue'
  import { showConfirmAlert, showConfirmAlertWithPreloader } from './../../../utils';
  import midtransMixin from './../../../mixins/midtrans-mixin'

  export default {
    data: () => ({
      provinces: [],
      selectedProject: {},
      selectedManageSubscriptionProject: {}
    }),
    beforeMount() {
      this.fetchProvinces();
    },
    mixins: [midtransMixin],
    methods: {
      ...mapActions(['fetchProvinces', 'fetchSubscriptionSnapToken', 'renewProjectSubscription', 'setPending', 'setCanceled']),
      reload() {
        this.$refs['project-item'].reload();
      },
      onProjectAdded() {
        this.$refs['project-item'].showDetailProjectTutorial();
        this.reload();
      },
      manageProjectSubscription(project) {
        this.selectedManageSubscriptionProject = project
      },
      async upgradeSubscription(subscriptionId) {
        const that = this
        await showConfirmAlertWithPreloader ({
          title: 'Ganti paket?',
          text: 'Paket yang Anda miliki saat ini akan digantikan oleh paket yang telah Anda pilih.',
          icon: 'question',
          
          preConfirm: async () => {

            const data = await this.fetchSubscriptionSnapToken({

            project_hashid: this.selectedManageSubscriptionProject.hashid,
              subscription_id: subscriptionId,
              type: 'renew',
            })

            if (data.status != 200) {
              throw new Error(data.message)
            }

            const snapToken = data.data.data.snap_token

            await new Promise((resolve, reject) => {
              window.snap.pay(snapToken, {
                  onSuccess: async () => {
                      Notify.success('Berhasil upgrade project');
                      that.$bvModal.hide('subscription-comparison-modal-upgrade')
                      resolve()
                      that.$bvModal.hide('manage-project-subscription')

                      that.reload()
                  },
                  async onPending() {
                      await that.setPending({
                        snapToken
                      })
                      resolve()
                  },
                  onError() {
                      Notify.failure('Tidak dapat melanjutkan pembayaran. Hubungi CS untuk informasi lebih lanjut');
                      resolve()
                  },
                  onClose() {
                      Notify.failure('Upgrading paket tidak dapat dilanjutkan karena pembayaran telah dibatalkan.');
                      that.setCanceled({
                        snapToken
                      })
                      resolve()
                  },
                  skipOrderSummary: false,
              });
            })
          }
        })
      },
      setEditedProject(project) {
        this.selectedProject = project;
      },
      chooseSubscription(subscriptionId) {
        this.$refs['add-project-modal-ref'].chooseSubscription(subscriptionId)
        this.$bvModal.hide('subscription-comparison-modal-new')
      }
    },
    computed: {
      ...mapGetters(['getProvinces', 'getProjects', 'getCompany', 'currentUser']),
    },
    components: {
      AppLayout,
      AddProject,
      ProjectItem,
      EditProject,
      SubscriptionComparison,
      SubscriptionManagement
    },
  };
</script>

<style scoped>
  .no-project-msg {
    font-size: 16px;
    line-height: 25px;
  }
</style>
