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
        <router-link
          :to="`/app/projects/${row.row.rowData.hashid}/rab`"
          class="rab-icon-bt mx-1"
        >
          <i class="iconsminds-book"></i>
        </router-link>
        <EditButton @click.prevent="editProject(row.row.rowData)" />
        <DeleteButton @click.prevent="deleteProject(row.row.rowData.hashid)" />
      </template>
    </CustomDataTable>
    <!-- <AddProject @project-added="reload" :provinces="getProvinces" /> -->
    <!-- <EditUnit :selected-unit="selectedUnit" @unit-updated="reload" /> -->
  </div>
</template>

<script>
  import projectField from '@/data/fields/project-field';
  import CustomDataTable from '@/components/DataTable/CustomDataTable';
  import AddProject from '@/components/Project/AddProject.vue';
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';
  import { apiUrl } from '../../constants/config';
  import { showConfirmAlert } from './../../utils';
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    data: () => ({
      fetchProjectAPI: `${apiUrl}/project`,
      fields: projectField,
    }),
    computed: {
      ...mapGetters(['getProvinces']),
    },
    methods: {
      ...mapActions(['destroyProject']),
      reload() {
        this.$refs['project-data-table'].reloadTable();
      },
      editProject(project) {
        this.$bvModal.show('edit-project');
        this.$emit('edit-project-clicked', project);
      },
      async deleteProject(id) {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus Project ?',
          text: 'Project ini akan dihapus secara PERMANEN !',
        });
        if (isConfirmed) {
          await this.destroyProject(id);
          Notify.success('Berhasil menghapus project');
          this.reload();
        }
      },
    },
    components: {
      CustomDataTable,
      AddProject,
      EditButton,
      DeleteButton,
    },
  };
</script>
