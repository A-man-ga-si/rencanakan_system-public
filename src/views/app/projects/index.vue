<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.projects')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-card-title>
            <div class="d-flex justify-content-between">
              <div class="left">
                {{ $t('menu.projects') }}
              </div>
              <div class="right">
                <b-btn v-b-modal.add-project-modal variant="primary">
                  Buat Projek Baru
                </b-btn>
              </div>
            </div>
          </b-card-title>
          <b-row v-if="getProjects.length <= 0">
            <b-col :xl="4" :md="5" :sm="6" class="mx-auto text-center">
              <b-img
                src="./../../../assets/img/panel/construction.png"
                alt="Empty Project Image"
                fluid
              />
              <p class="mt-3 no-project-msg">
                Tekan tombol "Buat Proyek Baru" untuk membuat RAB Pertamamu!
              </p>
            </b-col>
          </b-row>
          <b-row v-else>
            <b-col> </b-col>
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
      ...mapGetters(['getProvinces', 'getProjects']),
    },
    components: {
      AppLayout,
      AddProject,
    },
  };
</script>

<style scoped>
  .no-project-msg {
    font-size: 16px;
    line-height: 25px;
  }
</style>
