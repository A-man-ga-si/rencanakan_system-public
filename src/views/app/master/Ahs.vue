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
    <AhsItem />
  </div>
</template>

<script>
  import AhsItem from '@/components/Master/Ahs/AhsItem.vue';
  import { mapActions } from 'vuex';

  export default {
    data: () => ({
      provinces: [],
      selectedProvince: '',
    }),
    created() {
      this.loadProvinces();
    },
    methods: {
      ...mapActions(['fetchProvinces']),
      async loadProvinces() {
        const data = await this.fetchProvinces();
        this.provinces = data;
        this.selectedProvince = data[0].hashid;
      },
    },
    components: {
      AhsItem,
    },
  };
</script>
