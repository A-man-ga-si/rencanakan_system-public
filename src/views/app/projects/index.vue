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
        />
      </b-colxx>
    </b-row>
    <AddProject ref="add-project-modal-ref" data-title="Farewell!" data-intro="And this is the last step!" @project-added="onProjectAdded" :provinces="getProvinces" />
    <EditProject
      @project-edited="reload"
      :provinces="getProvinces"
      :selected-project="selectedProject"
    />
    <SubscriptionComparison @choose-subscription="chooseSubscription" />
  </div>
</template>

<script>
  import AppLayout from './../../../layouts/AppLayout.vue';
  import AddProject from './../../../components/Project/AddProject.vue';
  import { mapActions, mapGetters } from 'vuex';
  import ProjectItem from '@/components/Project/ProjectItem.vue';
  import EditProject from '@/components/Project/EditProject.vue';
  import SubscriptionComparison from '@/components/Project/SubscriptionComparison.vue'

  export default {
    data: () => ({
      provinces: [],
      selectedProject: {},
    }),
    beforeMount() {
      this.fetchProvinces();
    },
    methods: {
      ...mapActions(['fetchProvinces']),
      reload() {
        this.$refs['project-item'].reload();
      },
      onProjectAdded() {
        this.$refs['project-item'].showDetailProjectTutorial();
        this.reload();
      },
      setEditedProject(project) {
        this.selectedProject = project;
      },
      chooseSubscription(subscriptionId) {
        this.$refs['add-project-modal-ref'].chooseSubscription(subscriptionId)
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
    },
  };
</script>

<style scoped>
  .no-project-msg {
    font-size: 16px;
    line-height: 25px;
  }
</style>
