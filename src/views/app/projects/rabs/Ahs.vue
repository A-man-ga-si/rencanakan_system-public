<template>
  <div class="ahs-page mt-5">
    <b-row>
      <b-col :lg="6" :xl="3">
        <div class="text-right mb-2 position-relative">
          <label class="form-group has-float-label mb-0">
            <input
              v-model="form.searchQuery"
              type="text"
              class="form-control"
            />
            <span> Search Item </span>
          </label>
          <i
            class="simple-icon-magnifier position-absolute bg-white"
            style="top: 11px; right: 10px"
          />
        </div>
      </b-col>
      <b-col>
        <b-form-group horizontal>
          <b-form-radio-group
            class="pt-2"
            :options="searchQueryOptions"
            v-model="form.searchQueryCategory"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <FloatingActionButton @click="toggleAddCustomAhsModal" />
    <AhsItem
      v-for="(cAhs, idx) in customAhs"
      :key="idx"
      :custom-ahs-itemable-list="getCustomAhsItemableIds"
      :custom-ahs-item="cAhs"
      :units-list="getUnit"
      @custom-ahs-item-added="reloadData"
      @ahs-item-deleted="reloadData"
      @ahs-item-updated="reloadData"
      @delete-custom-ahs="reloadData"
      @custom-ahs-edit-bt-clicked="toggleEditCustomAhs"
    />
    <AddCustomAhs @custom-ahs-added="reloadData" />
    <EditCustomAhs
      @custom-ahs-updated="reloadData"
      :edited-custom-ahs="editedCustomAhs"
    />
  </div>
</template>

<script>
  import AhsItem from '../../../../components/Project/Rab/AhsItem.vue';
  import AddCustomAhs from '@/components/Project/Rab/AddCustomAhs.vue';
  import EditCustomAhs from '@/components/Project/Rab/EditCustomAhs.vue';
  import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        form: {
          searchQuery: '',
          searchQueryCategory: 'header',
        },
        searchQueryOptions: [
          { text: 'Header', value: 'header' },
          { text: 'Item', value: 'item' },
        ],
        customAhs: [],
        editedCustomAhs: {},
      };
    },
    created() {
      this.fetchCustomAhsItemableIds({
        projectId: this.$route.params.id,
      });
      this.fetchUnit();
    },
    mounted() {
      this.getCustomAhs();
    },
    methods: {
      ...mapActions([
        'fetchCustomAhs',
        'fetchCustomAhsItemableIds',
        'fetchUnit',
      ]),
      async getCustomAhs() {
        const { data } = await this.fetchCustomAhs({
          projectId: this.$route.params.id,
        });
        this.customAhs = data.data;
      },
      toggleAddCustomAhsModal() {
        this.$bvModal.show('add-custom-ahs');
      },
      toggleEditCustomAhs(customAhsItem) {
        this.editedCustomAhs = customAhsItem;
        this.$bvModal.show('edit-custom-ahs');
      },
      reloadData() {
        // FIXME: Not well optimized but yeah it's work
        this.fetchCustomAhsItemableIds({
          projectId: this.$route.params.id,
        });
        this.getCustomAhs();
      },
    },
    computed: {
      ...mapGetters(['getCustomAhsItemableIds', 'getUnit']),
    },
    components: {
      AhsItem,
      FloatingActionButton,
      AddCustomAhs,
      EditCustomAhs,
    },
  };
</script>
