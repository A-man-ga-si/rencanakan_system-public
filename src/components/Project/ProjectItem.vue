<template>
  <div class="project-item">
    <div class="text-right mb-3">
      <b-btn v-b-modal.add-project-modal variant="primary">
        {{ $t('pages.projects.add-project-modal-title') }}
      </b-btn>
    </div>
    <CustomDataTable
      ref="project-data-table"
      :api="fetchProjectAPI"
      title="Daftar Projects"
      :fields="fields"
    >
      <template slot="actions" slot-scope="row">
        <a
          href="#"
          @click.prevent="detailProject(row.row.rowData.hashid)"
          class="rab-icon-bt mx-1"
        >
          <ph-arrow-square-out :size="20" weight="light" />
        </a>
        <EditButton @click.prevent="editProject(row.row.rowData)" />
        <DeleteButton
          @click.prevent="
            deleteProject(row.row.rowData.name, row.row.rowData.hashid)
          "
        />
      </template>
    </CustomDataTable>
  </div>
</template>

<script>
  import projectField from '@/data/fields/project-field';
  import CustomDataTable from '@/components/DataTable/CustomDataTable';
  import AddProject from '@/components/Project/AddProject.vue';
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';
  import Swal from 'sweetalert2';
  import { apiDomain, apiUrl } from '../../constants/config';
  import { showConfirmAlert } from './../../utils';
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';
  import { PhArrowSquareOut } from 'phosphor-vue';

  export default {
    data: () => ({
      fetchProjectAPI: `${apiUrl}/project`,
      fields: projectField,
    }),
    computed: {
      ...mapGetters(['getProvinces']),
    },
    methods: {
      ...mapActions(['destroyProject', 'markLastOpenedAt']),
      reload() {
        this.$refs['project-data-table'].reloadTable();
      },
      detailProject(projectHashid) {
        // Keep this asynchronously !
        this.markLastOpenedAt({
          projectId: projectHashid,
        });
        this.$router.push({ path: `/app/projects/${projectHashid}/rab/ahs` });
      },
      editProject(project) {
        this.$bvModal.show('edit-project');
        this.$emit('edit-project-clicked', project);
      },
      deleteProject(name, id) {
        console.log(name);
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
            Swal.fire(
              'Gagal',
              'Nama project yang anda masukkan salah !',
              'error'
            );
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
    },
  };
</script>
