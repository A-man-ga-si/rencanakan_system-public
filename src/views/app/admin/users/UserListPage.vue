<template>
  <b-card>
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 32px"
    >
      <h4 class="card-title" style="margin-bottom: 0px">Daftar Pengguna</h4>
    </div>
    <div class="header">
      <ValidationInput
        class="search-input"
        :label="'Search Email/ Phone'"
        :fieldName="''"
        @input="onChangeSearchValue"
      />

      <input-dropdown
        class="sort-input"
        :input-style="{ width: '150px' }"
        :selected-option="selectedSortOption"
        :options="sortOptions"
        :did-select-option="didSelectOption"
      />
    </div>
    <SectionLoading v-if="users === undefined" title="Memuat Daftar Pengguna" />
    <table v-else class="table table-responsive-md shadow-sm w-100 mb-5">
      <thead>
        <th
          class="table-header"
          style="border-top-left-radius: 8px; width: 15%; min-width: 150px"
        >
          Nama Lengkap
        </th>
        <th class="table-header" style="width: 20%; min-width: 150px">Email</th>
        <th class="table-header" style="width: 15%; min-width: 150px">
          Nomor Telepon
        </th>
        <th class="table-header" style="width: 15%; min-width: 150px">
          Pekerjaan
        </th>
        <th class="table-header" style="width: 10%; min-width: 125px">
          Proyek Aktif
        </th>
        <th class="table-header" style="width: 15%; min-width: 150px">
          Login Terakhir
        </th>
        <th
          class="table-header"
          style="border-top-right-radius: 8px; width: 10%; min-width: 125px"
        >
          Aksi
        </th>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.hashid">
          <td>{{ `${user.first_name} ${user.last_name}` }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.job }}</td>
          <td>{{ user.project_count }}</td>
          <td>{{ user.last_login ?? '-' }}</td>
          <td>
            <router-link :to="`admin/${user.hashid}`" class="rab-icon-bt mx-1">
              <ph-arrow-square-out :size="20" weight="light" />
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="footer">
      <div class="data-hint">
        <span style="margin: auto 0px">{{ dataHintLabel }}</span>
        <loader-circle v-if="isLoading" class="circle-loading" />
      </div>
      <Pagination
        class="pagination"
        :current-page="currentPage"
        :total-page="totalPage"
        :on-change-page="didChangePage"
      />
    </div>
  </b-card>
</template>

<script>
  import { mapActions } from 'vuex';
  import {
    InputDropdown,
    LoaderCircle,
    SectionLoading,
    Pagination,
    ValidationInput,
  } from '@/components/Common';
  import { PhArrowSquareOut } from 'phosphor-vue';
  import { debounce } from 'lodash';

  export default {
    data() {
      return {
        users: undefined,
        isLoading: false,

        /* Search Datas */
        searchQuery: undefined,

        /* Sort By Datas */
        sortOptions: [
          { key: 'last_login', label: 'Login Terakhir' },
          { key: 'project_count', label: 'Proyek Aktif' },
        ],
        selectedSortOption: undefined,

        /* Pagination Datas */
        currentPage: 1,
        totalData: 0,
        totalPage: 0,
        limit: 15,
        dataHintLabel: '',
      };
    },
    methods: {
      ...mapActions(['fetchUsers']),
      async reloadData() {
        this.isLoading = true;
        const response = await this.fetchUsers({
          limit: this.limit,
          page: this.currentPage,
          search: this.searchQuery,
          sort: this.selectedSortOption?.key,
        });
        this.isLoading = false;
        this.users = response.data.users;
        this.totalData = response.data.pagination_attribute.total_data;
        this.totalPage = response.data.pagination_attribute.total_page;
        this.updateDataHintLabel();
      },
      onChangeSearchValue: debounce(function (value) {
        this.searchQuery = value;
        this.reloadData();
      }, 500),
      didSelectOption(key) {
        this.selectedSortOption = this.sortOptions.find(
          (sortOption) => sortOption.key == key,
        );
        this.reloadData();
      },
      didChangePage(page) {
        this.currentPage = page;
        this.reloadData();
      },
      updateDataHintLabel() {
        let maxDataCount = this.limit * this.currentPage;
        if (maxDataCount > this.totalData) {
          maxDataCount = this.totalData;
        }
        this.dataHintLabel = `Showing ${
          this.limit * (this.currentPage - 1) + 1
        }-${maxDataCount} of ${this.totalData}`;
      },
    },
    created() {
      this.selectedSortOption = this.sortOptions[0];
      this.reloadData();
    },
    components: {
      /* Components */
      InputDropdown,
      LoaderCircle,
      SectionLoading,
      Pagination,
      ValidationInput,

      /* Icons */
      PhArrowSquareOut,
    },
  };
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .search-input {
    width: 500px;
    max-width: 100%;
  }

  .table-header {
    background-color: #00365a;
    color: white;
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .data-hint {
    display: flex;
    margin-top: auto;
    margin-bottom: auto;
    font-size: 14px;
  }

  .circle-loading {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 16px;
    height: 24px;
    width: 24px;
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
    }

    .search-input {
      margin-bottom: 16px;
    }

    .sort-input {
      margin-left: auto;
    }

    .footer {
      display: flex;
      justify-content: unset;
      flex-direction: column;
    }

    .pagination {
      order: 1;
      margin-bottom: 24px;
    }

    .data-hint {
      order: 2;
      margin-left: auto;
    }
  }
</style>
