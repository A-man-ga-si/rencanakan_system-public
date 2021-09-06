<template>
  <div>
    <!-- <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.projects')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row> -->
    <a href="#" v-if="!getActiveCompany">
      <b-alert show variant="danger" class="rounded mb-4">
        {{ $t('alert.email-no-active-company') }}
      </b-alert>
    </a>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
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
              <ProjectListTable />
            </b-col>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <AddProject :provinces="getProvinces" />
  </div>
</template>

<script>
  import AppLayout from './../../../layouts/AppLayout.vue';
  import AddProject from './../../../components/Project/AddProject.vue';
  import { mapActions, mapGetters } from 'vuex';
  import ProjectListTable from './../../../components/Project/ProjectListTable.vue';

  export default {
    data: () => ({
      provinces: [],
    }),
    beforeMount() {
      this.fetchProvinces();
    },
    methods: {
      ...mapActions(['fetchProvinces']),
    },
    computed: {
      ...mapGetters(['getProvinces', 'getProjects', 'getActiveCompany']),
    },
    components: {
      AppLayout,
      AddProject,
      ProjectListTable,
    },
  };
</script>

<style scoped>
  .no-project-msg {
    font-size: 16px;
    line-height: 25px;
  }
</style>
