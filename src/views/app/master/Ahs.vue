<template>
  <div class="ahs-master">
    <div class="mb-3 d-flex justify-content-between">
      <div class="left">
        <div
          class="labeled-select position-relative d-inline-block"
          style="width: 300px"
        >
          <span class="px-1"> Provinsi</span>
          <v-select
            label="name"
            :reduce="province => province.hashid"
            :options="provinces"
            v-model="selectedProvince"
          />
        </div>
      </div>
    </div>
    <ul class="ahs-item-list">
      <li v-for="(ahs, idx) in getAhs" :key="idx">
        <AhsItem
          :idx="idx"
          :codes-list="codesList"
          :units-list="getUnit"
          :ahs-itemable-list="getAhsItemableIds"
          :ahs-item="ahs"
          @ahs-deleted="getAhsMaster"
          @ahs-item-added="getAhsMaster"
          @ahs-item-updated="getAhsMaster"
          @ahs-item-deleted="getAhsMaster"
          @ahs-item-edit-clicked="editAhs"
        />
      </li>
    </ul>
    <b-pagination
      class="mx-auto w-100 mt-5"
      style="justify-content: center"
      v-model="currentPage"
      :total-rows="getAhsCount"
      :per-page="perPage"
    ></b-pagination>
    <AddAhs @ahs-added="ahsAdded" />
    <EditAhs @ahs-updated="getAhsMaster" :selected-ahs="selectedAhs" />
    <FloatingActionButton v-b-modal.add-ahs-modal />
  </div>
</template>

<script>
  import FloatingActionButton from '@/components/Project/FloatingActionButton.vue';
  import AhsItem from '@/components/Master/Ahs/AhsItem.vue';
  import AddAhs from '@/components/Master/Ahs/AddAhs.vue';
  import EditAhs from '@/components/Master/Ahs/EditAhs.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data: () => ({
      perPage: 5,
      totalRows: 0,
      currentPage: 1,
      codesList: ['L.01'],
      unitsList: ['OH'],
      provinces: [],
      selectedProvince: '',
      selectedAhs: {},
    }),
    created() {
      this.loadProvinces();
      this.fetchUnit();
      this.fetchAhsItemableIds();
    },
    methods: {
      ...mapActions([
        'fetchProvinces',
        'fetchAhs',
        'fetchUnit',
        'fetchAhsItemableIds',
      ]),
      ahsAdded() {
        this.fetchUnit();
        this.fetchAhsItemableIds();
        this.getAhsMaster();
      },
      getAhsMaster() {
        this.fetchAhs({
          province: this.selectedProvince,
          page: this.currentPage,
          perPage: this.perPage,
        });
      },
      async loadProvinces() {
        const data = await this.fetchProvinces();
        this.provinces = data;
        this.selectedProvince = data[0].hashid;
      },
      editAhs(ahs) {
        this.selectedAhs = ahs;
      },
    },
    computed: {
      ...mapGetters(['getAhs', 'getUnit', 'getAhsItemableIds', 'getAhsCount']),
    },
    components: {
      AhsItem,
      FloatingActionButton,
      AddAhs,
      EditAhs,
    },
    watch: {
      selectedProvince() {
        this.getAhsMaster();
      },
      currentPage() {
        this.getAhsMaster();
      },
    },
  };
</script>

<style scoped>
  .ahs-item-list {
    list-style-type: none;
    padding-left: 0;
  }
</style>
