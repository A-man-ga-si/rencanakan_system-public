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
          :codes-list="codesList"
          :units-list="getUnit"
          :ahs-itemable-list="getAhsItemableIds"
          :ahs-item="ahs"
          @ahs-deleted="fetchAhs(selectedProvince)"
          @ahs-item-added="fetchAhs(selectedProvince)"
          @ahs-item-updated="fetchAhs(selectedProvince)"
        />
      </li>
    </ul>
    <AddAhs @ahs-added="fetchAhs(selectedProvince)" />
    <FloatingActionButton v-b-modal.add-ahs-modal />
  </div>
</template>

<script>
  import FloatingActionButton from '@/components/Project/FloatingActionButton.vue';
  import AhsItem from '@/components/Master/Ahs/AhsItem.vue';
  import AddAhs from '@/components/Master/Ahs/AddAhs.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data: () => ({
      codesList: ['L.01'],
      unitsList: ['OH'],
      provinces: [],
      selectedProvince: '',
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
      async loadProvinces() {
        const data = await this.fetchProvinces();
        this.provinces = data;
        this.selectedProvince = data[0].hashid;
      },
    },
    computed: {
      ...mapGetters(['getAhs', 'getUnit', 'getAhsItemableIds']),
    },
    components: {
      AhsItem,
      FloatingActionButton,
      AddAhs,
    },
    watch: {
      selectedProvince() {
        this.fetchAhs(this.selectedProvince);
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
