<template>
  <div>
    <b-row class="mb-3">
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Proyek" />
        <div class="separator"></div>
      </b-colxx>
    </b-row>
    <a href="#" v-if="!getCompany">
      <b-alert show variant="danger" class="rounded mb-4">
        {{ $t('alert.email-no-active-company') }}
      </b-alert>
    </a>
    <b-row>
      <b-colxx xxs="12">
        <ProjectItem
          ref="project-item"
          @edit-project-clicked="setEditedProject"
        />
        <!-- <b-card class="mb-4">
          <b-row v-if="getProjects.length <= 0">
            <b-col :xl="4" :md="5" :sm="6" class="mx-auto text-center">
              <b-img
                src="./../../../assets/img/panel/construction.png"
                alt="Empty Project Image"
                fluid
              />
              <p class="mt-3 no-project-msg">
                {{ $t('pages.projects.no-project-alert') }}
              </p>
              <b-btn v-b-modal.add-project-modal variant="primary">
                {{ $t('pages.projects.add-project-modal-title') }}
              </b-btn>
            </b-col>
          </b-row>
          <b-row v-else>
            <b-col>
              // TODO: FIll it with ProjectItem component
            </b-col>
          </b-row>
        </b-card> -->
      </b-colxx>
    </b-row>
    <AddProject data-title="Farewell!" data-intro="And this is the last step!" @project-added="onProjectAdded" :provinces="getProvinces" />
    <EditProject
      @project-edited="reload"
      :provinces="getProvinces"
      :selected-project="selectedProject"
    />
  </div>
</template>

<script>
  import AppLayout from './../../../layouts/AppLayout.vue';
  import AddProject from './../../../components/Project/AddProject.vue';
  import { mapActions, mapGetters } from 'vuex';
  import ProjectItem from '@/components/Project/ProjectItem.vue';
  import EditProject from '@/components/Project/EditProject.vue';

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
    },
    computed: {
      ...mapGetters(['getProvinces', 'getProjects', 'getCompany']),
    },
    components: {
      AppLayout,
      AddProject,
      ProjectItem,
      EditProject,
    },
  };
</script>

<style scoped>
  .no-project-msg {
    font-size: 16px;
    line-height: 25px;
  }
</style>
