<template>
  <section-loading
    v-if="projects === undefined"
    title="Memuat Daftar Proyek"
    style="margin: auto auto"
  />

  <div v-else class="content-container">
    <!-- User Details Section -->
    <b-card class="user-container">
      <h2 style="font-size: 1.4rem">Detail Pengguna</h2>
      <div
        style="width: 100%; height: 2px; margin: 16px 0px; background: #dee2e6"
      />
      <b-row class="g-3">
        <b-col class="user-info-item" cols="12" sm="4" lg="12">
          <h3 class="user-info-label">Nama Lengkap:</h3>
          <p>{{ user.first_name }} {{ user.last_name }}</p>
        </b-col>
        <b-col class="user-info-item" cols="12" sm="4" lg="12">
          <h3 class="user-info-label">Email:</h3>
          <p>{{ user.email }}</p>
        </b-col>
        <b-col class="user-info-item" cols="12" sm="4" lg="12">
          <h3 class="user-info-label">Nomor Telepon:</h3>
          <p>{{ user.phone }}</p>
        </b-col>
        <b-col class="user-info-item" cols="12" sm="4" lg="12">
          <h3 class="user-info-label">Pekerjaan:</h3>
          <p>{{ user.job }}</p>
        </b-col>
        <b-col class="user-info-item" cols="12" sm="4" lg="12">
          <h3 class="user-info-label">Login Terakhir:</h3>
          <p>{{ user.last_login ?? '-' }}</p>
        </b-col>
        <b-col class="user-info-item" cols="12" sm="4" lg="12">
          <h3 class="user-info-label">Kuota Demo:</h3>
          
          <div v-if="!isDemoQuotaEditing" style="display: flex;">
            <p style="margin: auto 0px; line-height: 0.5px;">{{ form.demoQuota }} Paket Demo</p>
            <button
              style="margin-left: 8px; text-decoration: underline; color: #00365a;"
              @click="onClickEditDemoQuotaButton">
              Edit
            </button>
          </div>

          <div v-else style="display: flex">
            <input 
              :disabled="isDemoQuotaLoading"
              v-model="form.demoQuota"
              style="width: 100%; border: 1px solid #d7d7d7; padding: 4px 8px; width: 75px;"/>
            <div v-if="!isDemoQuotaLoading" style="display: flex">
              <button
                style="margin-left: 8px; text-decoration: underline; color: #B5312E;"
                @click="onClickCancelDemoQuotaButton">
                Batal
              </button>
              <button
                style="margin-left: 8px; text-decoration: underline; color: #57AA54;"
                @click="onClickSaveDemoQuotaButton">
                Simpan
              </button>
            </div>
            <loader-circle v-else style="margin: auto 0px; margin-left: 8px;" />
          </div>
        </b-col>
      </b-row>
    </b-card>

    <!-- Project List Sections -->
    <b-card class="project-container">
      <h2 style="margin-bottom: 24px">Daftar Proyek</h2>
      <div style="display: flex; flex-direction: column; overflow-x: auto">
        <table class="table table-responsive-md shadow-sm mb-5">
          <thead>
            <th
              class="table-header"
              style="border-top-left-radius: 8px; width: 5%; min-width: 50px"
            >
              #
            </th>
            <th class="table-header" style="width: 20%; min-width: 200px">
              Nama
            </th>
            <th class="table-header" style="width: 15%; min-width: 150px">
              Paket
            </th>
            <th class="table-header" style="width: 15%; min-width: 150px">
              Tanggal Kadaluarsa
            </th>
            <th class="table-header" style="width: 10%; min-width: 150px">
              Terakhir Dibuka
            </th>
            <th class="table-header" style="width: 15%; min-width: 150px">
              Tanggal Dibuat
            </th>
            <th
              class="table-header"
              style="border-top-right-radius: 8px; width: 5%; min-width: 100px"
            >
              Aksi
            </th>
          </thead>
          <tbody>
            <tr v-for="(project, index) in projects" :key="project.hashid">
              <td>{{ index + 1 }}</td>
              <td>{{ project.name }}</td>
              <td>{{ project.subscription.name }}</td>
              <td>{{ project.activeOrder.expired_at }}</td>
              <td>{{ project.last_opened_at }}</td>
              <td>{{ formatCreatedDate(project.created_at) }}</td>
              <td>
                <button @click="() => onClickEditButton(project)">
                  <ph-pencil :size="20" weight="light" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <pagination
          style="margin: auto"
          :current-page="currentPage"
          :total-page="totalPage"
          :on-change-page="onChangePage"
        />
      </div>
    </b-card>
    <project-form-modal
      :subscriptions="subscriptions"
      :project="selectedProject"
      @on-update-project="onUpdateProject"
    />
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import { PhPencil } from 'phosphor-vue';
import { Notify } from 'notiflix';
import { LoaderCircle, Pagination, SectionLoading } from '@/components/Common';
import { ProjectFormModal } from './components';

export default {
  data() {
    return {
      user: undefined,
      subscriptions: [],
      projects: undefined,
      selectedProject: undefined,
      currentPage: 1,
      totalPage: 0,
      
      isDemoQuotaEditing: false,
      isDemoQuotaLoading: false,
      form: { demoQuota: 0 }
    };
  },
  methods: {
    ...mapActions([
      'fetchUserDetail',
      'fetchSubscriptions',
      'fetchUserProjects',
      'updateUserDemoQuota'
    ]),
    async reloadData() {
      this.isLoading = true;
      await this.startFetchUserDetail();
      await this.startFetchSubscriptions();
      await this.startFetchProjects();
      this.isLoading = false;
    },
    async startFetchUserDetail() {
      const response = await this.fetchUserDetail(this.$route.params.userId);
      this.user = response.user;

      // Setup form object
      this.form.demoQuota = this.user.demo_quota
    },
    async startFetchSubscriptions() {
      const response = await this.fetchSubscriptions();
      this.subscriptions = response.subscriptions;
    },
    async startFetchProjects() {
      const response = await this.fetchUserProjects({
        userHashId: this.$route.params.userId,
        page: this.currentPage,
        limit: 10,
      });
      this.projects = response.data.projects;
      this.totalPage = response.data.pagination_attribute.total_page;
    },
    formatCreatedDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    onChangePage(page) {
      this.currentPage = page;
      this.reloadData();
    },
    onClickEditDemoQuotaButton() {
      this.isDemoQuotaEditing = true;
    },
    onClickCancelDemoQuotaButton() {
      this.isDemoQuotaEditing = false;
    },
    async onClickSaveDemoQuotaButton() {
      this.isDemoQuotaLoading = true;
      try {
        const response = await this.updateUserDemoQuota({
          userId: this.user.hashid,
          demoQuota: this.form.demoQuota
        });
        this.isDemoQuotaLoading = false;
        this.isDemoQuotaEditing = false;
      } catch (error) {
        this.form.demoQuota = this.user.demo_quota;
        Notify.failure(
          error.response.data.message || 'Terjadi kesalahan saat memperbarui kuota demo'
        );
        this.isDemoQuotaLoading = false;
        this.isDemoQuotaEditing = false;
      }
      
    },
    onClickEditButton(project) {
      this.selectedProject = project;
      this.$bvModal.show('admin-project-form-modal');
    },
    onUpdateProject() {
      this.reloadData();
    },
  },
  mounted() {
    this.reloadData();
  },
  computed: {
    ...mapGetters(['getProjects']),
  },
  components: {
    /* Components */
    LoaderCircle,
    Pagination,
    SectionLoading,
    ProjectFormModal,

    /* Icons */
    PhPencil,
  },
};
</script>

<style scoped>
p {
  margin: 0px;
}

button {
  background-color: transparent;
  border: none;
  padding: 0px;
}

.content-container {
  display: flex;
  flex-direction: column;
}

.user-container {
  margin-bottom: 24px;
}

.project-container {
  margin-bottom: auto;
}

.user-container,
.project-container {
  width: 100%;
}

.user-info-item {
  margin-bottom: 18px;
}

.user-info-item:nth-last-child(1) {
  margin-bottom: 0px;
}

.user-info-label {
  margin-bottom: 4px;
  font-weight: bold;
  color: black;
  font-size: 14px;
}

.table-header {
  background-color: #00365a;
  color: white;
}

@media (min-width: 768px) {
  .user-info-item:nth-last-child(2) {
    margin-bottom: 0;
  }
}

@media (min-width: 1280px) {
  .user-info-item:nth-last-child(2) {
    margin-bottom: 18px;
  }

  .content-container {
    flex-direction: row;
  }

  .user-container {
    margin-right: 24px;
    margin-bottom: auto;
    width: 375px;
  }
}
</style>
