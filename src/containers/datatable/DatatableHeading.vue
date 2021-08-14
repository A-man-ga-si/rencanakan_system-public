<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ $t('menu.projects') }}</h1>
      <div class="top-right-button-container">
        <b-btn v-b-modal.add-project-modal variant="primary">
          {{ $t('pages.projects.add-project-modal-title') }}
        </b-btn>
      </div>
      <piaf-breadcrumb />
      <div class="mb-2 mt-2">
        <b-button
          variant="empty"
          class="pt-0 pl-0 d-inline-block d-md-none"
          v-b-toggle.displayOptions
        >
          {{ $t('pages.display-options') }}
          <i class="simple-icon-arrow-down align-middle" />
        </b-button>
        <b-collapse id="displayOptions" class="d-md-block">
          <div class="d-block d-md-inline-block pt-1">
            <div class="search-sm d-inline-block float-md-left mr-1 align-top">
              <b-input
                :placeholder="$t('menu.search')"
                @input="val => searchChange(val)"
              />
            </div>
          </div>
          <div class="float-md-right pt-1">
            <span class="text-muted text-small mr-1 mb-2">
              {{ from }}-{{ to }} of {{ total }}
            </span>
            <b-dropdown
              id="ddown2"
              right
              :text="`${perPage}`"
              variant="outline-dark"
              class="d-inline-block"
              size="xs"
            >
              <b-dropdown-item
                v-for="(size, index) in pageSizes"
                :key="index"
                @click="changePageSize(size)"
              >
                {{ size }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-collapse>
      </div>
      <div class="separator mb-5" />
    </b-colxx>
  </b-row>
</template>
<script>
  export default {
    props: [
      'title',
      'selectAll',
      'isSelectedAll',
      'isAnyItemSelected',
      'keymap',
      'changePageSize',
      'searchChange',
      'from',
      'to',
      'total',
      'perPage',
    ],
    data() {
      return {
        categories: [
          {
            label: 'Cakes',
            value: 'Cakes',
          },
          {
            label: 'Cupcakes',
            value: 'Cupcakes',
          },
          {
            label: 'Desserts',
            value: 'Desserts',
          },
        ],
        statuses: [
          {
            text: 'ON HOLD',
            value: 'ON HOLD',
          },
          {
            text: 'PROCESSED',
            value: 'PROCESSED',
          },
        ],
        sortOptions: [
          {
            column: 'title',
            label: 'Product Name',
          },
          {
            column: 'category',
            label: 'Category',
          },
          {
            column: 'status',
            label: 'Status',
          },
        ],
        pageSizes: [4, 8, 12],
      };
    },
  };
</script>
