<template>
  <div class="project-item">
    <div class="text-right mb-3">
      <b-btn v-b-modal.add-project-modal variant="primary" id="add-button-tutorial" title="Tombol untuk membuat project">
        <tutorial-popover target="add-button-tutorial" title="Tombol Buat Project" :is-show="createProjectButtonTutorial" tutorial-key="create_project" :end-of-tutorial="true" @understand="createProjectButtonTutorial = false">
          Tekan tombol ini untuk membuat project baru
        </tutorial-popover>
        {{ $t('pages.projects.add-project-modal-title') }}
      </b-btn>
    </div>
    <CustomDataTable
      ref="project-data-table"
      :api="fetchProjectAPI"
      title="Daftar Proyek"
      :fields="fields"
    >
      <template slot="actions" slot-scope="row">
          <a
            v-b-modal.show-project-modal
            href="#"
            id="show-project-modal"
            @click.prevent="detailProject(row.row.rowData.hashid, row.row.rowData.order)"
            class="rab-icon-bt mx-1"
            title="Tombol untuk melihat detail project"
          >
            <ph-arrow-square-out :size="20" weight="light" />
            <tutorial-popover target="show-project-modal" title="Ubah AHS" :is-show="editAhsButtonTutorial" tutorial-key="manage_project" :end-of-tutorial="false" @understand="showEditProjectButtonTutorial" prevent-imediate-close>
              Klik tombol ini untuk mengubah AHS
            </tutorial-popover>
          </a>
        <EditButton v-b-modal.edit-project-modal id="edit-project-modal" @click.prevent="editProject(row.row.rowData)" title="Tombol untuk mengedit project">
          <tutorial-popover target="edit-project-modal" title="Edit Project" :is-show="editProjectButtonTutorial" tutorial-key="manage_project" :end-of-tutorial="false" @understand="showUpgradeProjectButtonTutorial" prevent-imediate-close>
            Klik tombol ini untuk mengubah project
          </tutorial-popover>
          <ph-pencil :size="20" weight="light" />
        </EditButton>
        <div class="d-inline-block mr-2" @click="manageSubscriptionProject(row.row.rowData)" v-b-modal.manage-project-subscription id="upgrade-project-btn" style="cursor: pointer;">
          <tutorial-popover target="upgrade-project-btn" title="Upgrade Project" :is-show="upgradeProjectButtonTutorial" tutorial-key="manage_project" :end-of-tutorial="false" @understand="showDeleteProjectButtonTutorial" prevent-imediate-close>
            Klik tombol ini untuk upgrade paket project
          </tutorial-popover>
        <PhCreditCard :size="20" weight="light" />
        </div>
        <DeleteButton
        title="Tombol untuk menghapus project"
        id="delete-project-btn"
          @click.prevent="
            deleteProject(row.row.rowData.name, row.row.rowData.hashid)
          "
        >
        <tutorial-popover target="delete-project-btn" title="Hapus Project" :is-show="deleteProjectButtonTutorial" tutorial-key="manage_project" :end-of-tutorial="true" @understand="deleteProjectButtonTutorial = false" prevent-imediate-close>
            Klik tombol ini untuk menghapus project
        </tutorial-popover>
        <ph-trash :size="20" weight="light" />
      </DeleteButton>
      </template>
    </CustomDataTable>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { Notify } from 'notiflix';
  import { PhArrowSquareOut, PhCreditCard } from 'phosphor-vue';
  import Swal from 'sweetalert2';
  import tutorialMixin from '@/mixins/tutorial-mixin';
  import projectField from '@/data/fields/project-field';
  import CustomDataTable from '@/components/DataTable/CustomDataTable';
  import AddProject from '@/components/Project/AddProject.vue';
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';
  import TutorialPopover from '@/components/Common/TutorialPopover.vue';
  import { apiDomain, apiUrl } from '@/constants/config';
  import { PhPencil, PhTrash } from 'phosphor-vue';

  export default {
    mixins: [tutorialMixin],
    data: () => ({
      fetchProjectAPI: `${apiUrl}/project`,
      fields: projectField,
      createProjectButtonTutorial: false,
      editAhsButtonTutorial: false,
      editProjectButtonTutorial: false,
      deleteProjectButtonTutorial: false,
      upgradeProjectButtonTutorial: false,
    }),
    computed: {
      ...mapGetters(['getProvinces', 'isInTutorial']),
    },
    mounted() {
      if (this.shouldShowTutorial('create_project')) {
        this.createProjectButtonTutorial = this.activateTutorial()
      }
    },
    methods: {
      ...mapActions(['destroyProject', 'markLastOpenedAt', 'changeInTutorial', 'showProject']),
      showDetailProjectTutorial() {
        if (this.shouldShowTutorial('manage_project')) {
          this.editAhsButtonTutorial = this.activateTutorial()
        }
      },
      showEditProjectButtonTutorial() {
        this.editAhsButtonTutorial = false
        if (this.shouldShowTutorial('manage_project')) {
          this.editProjectButtonTutorial = this.activateTutorial()
        }
      },
      showDeleteProjectButtonTutorial() {
        this.upgradeProjectButtonTutorial = false
        if (this.shouldShowTutorial('manage_project')) {
          this.deleteProjectButtonTutorial = this.activateTutorial()
        }
      },
      showUpgradeProjectButtonTutorial() {
        this.editProjectButtonTutorial = false
        if (this.shouldShowTutorial('manage_project')) {
          this.upgradeProjectButtonTutorial = this.activateTutorial()
        }
      },
      reload() {
        this.$refs['project-data-table'].reloadTable();
      },
      ...mapMutations([
        'setCurrentActiveProject'
      ]),
      async detailProject(projectHashid, order) {

        if (order.is_expired) {
          Notify.failure('Project telah expired. Perpanjang / upgrade subscription untuk membuka & melanjutkan project ini.')
          return
        }

        // Keep this asynchronously !
        this.markLastOpenedAt({
          projectId: projectHashid,
        });

        const res = await this.showProject(projectHashid)
        await this.setCurrentActiveProject(res.data.data.project)

        this.$router.push({ path: `/app/projects/${projectHashid}/rab/summary` });
      },
      editProject(project) {
        this.$bvModal.show('edit-project');
        this.$emit('edit-project-clicked', project);
      },
      manageSubscriptionProject(projectData) {
        this.$emit('manage-project-subscription-button-clicked', projectData)
      },
      deleteProject(name, id) {
        Swal.fire({
          title: 'Hapus Project ?',
          html: `<div class="alert alert-danger bg-white border-danger text-left" style="border-radius: 10px;">
                  <div class="d-flex">
                    <div class="left">
                      <img src="${apiDomain}/assets/images/warning.png" width="30"></img>
                    </div>
                    <div class="right">
                      <h5 class="ml-2 mb-0">Project yang sudah dihapus tidak dapat dikembalikan</h5>
                    </div>
                  </div>
                </div><h5 class="text-left">Tulis kembali nama project dibawah untuk mengkonfirmasi aksi ini :</h5>`,
          input: 'text',
          showCancelButton: true,
          cancelButtonText: 'Kembali',
          confirmButtonText: 'Hapus',
          confirmButtonColor: '#dc3545',
        }).then(async result => {
          if (result.value == name) {
            await this.destroyProject(id);
            Notify.success('Berhasil menghapus project');
            this.reload();
          } else {
            if (result.value) {
              Swal.fire(
                'Gagal',
                'Nama project yang anda masukkan salah !',
                'error'
              );
            }
          }
        });
        // const { isConfirmed } = await showConfirmAlert({
        //   title: 'Hapus Project ?',
        //   text: 'Project ini akan dihapus secara PERMANEN !',
        // });
        // if (isConfirmed) {
        // }
      },
    },
    components: {
      CustomDataTable,
      AddProject,
      EditButton,
      DeleteButton,
      PhArrowSquareOut,
      TutorialPopover,
      PhPencil,
      PhTrash,
      PhCreditCard
    },
  };
</script>
