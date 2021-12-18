<template>
  <div class="ahs-page mt-5">
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
