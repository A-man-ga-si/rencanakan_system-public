<template>
  <b-card class="shadow-none border">
    <b-card-header class="p-0">
      <h5>
        {{ company.name }}
      </h5>
      <hr />
    </b-card-header>
    <b-card-body class="p-0">
      <ul class="pl-0" style="list-style-type: none">
        <li class="mb-2">
          <span class="font-weight-bold">Director Name : </span>
          {{ company.director_name }}
        </li>
        <li class="mb-2">
          <span class="font-weight-bold">Phone Number : </span>
          {{ company.phone_number }}
        </li>
        <li class="mb-2">
          <span class="font-weight-bold">Status : </span>
          <b-badge :variant="company.is_active ? 'primary' : 'outline-primary'">
            {{ company.is_active ? 'Aktif' : 'Tidak Aktif' }}
          </b-badge>
        </li>
      </ul>
      <hr />
      <div class="text-right">
        <b-btn
          v-if="!company.is_active"
          size="sm"
          variant="outline-danger"
          @click.prevent="deleteItemCompany(company.id, company.name)"
        >
          Delete
        </b-btn>
        <b-btn size="sm" variant="outline-success">Update</b-btn>
        <b-btn
          size="sm"
          @click="setItemActiveCompany(company.id)"
          v-if="!company.is_active"
        >
          Set Active
        </b-btn>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
  import Swal from 'sweetalert2';
  import { mapActions } from 'vuex';

  export default {
    props: ['company'],
    methods: {
      ...mapActions(['setActiveCompany', 'deleteCompany']),
      async setItemActiveCompany(id) {
        await this.setActiveCompany(id);
        this.$notify(
          'success',
          'Berhasil',
          'Berhasil merubah status aktif perusahaan',
          {
            duration: 3000,
            permanent: false,
          }
        );
      },
      async deleteItemCompany(id, companyName) {
        try {
          const { isConfirmed } = await Swal.fire({
            title: 'Hapus Profil Perusahaan Ini ?',
            text: 'Aksi ini akan MENGHAPUS SEMUA data project ! masukkan nama perusahaan anda untuk melanjutkan',
            input: 'text',
            showLoaderOnConfirm: true,
            inputPlaceholder: companyName,
            icon: 'warning',
            showCancelButton: true,
            preConfirm: data => {
              if (data != companyName) {
                this.$notify('error', 'Delete Error', 'Nama perusahaan salah', {
                  duration: 3000,
                  permanent: false,
                });
                return false;
              }
              return true;
            },
          });
          if (isConfirmed) {
            await this.deleteCompany(id);
            this.$notify(
              'success',
              'Berhasil',
              'Berhasil menghapus profil perusahaan',
              {
                duration: 3000,
                permanent: false,
              }
            );
          }
        } catch (err) {
          this.$notify('error', 'Delete Error', err.response.data.message, {
            duration: 3000,
            permanent: false,
          });
        }
      },
    },
  };
</script>
