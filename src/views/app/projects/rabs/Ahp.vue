<template>
  <div class="ahsp-page mt-5">
    <AhpItem
      v-for="(customAhp, idx) in customAhps"
      :custom-ahp="customAhp"
      :units="getUnit"
      :key="idx"
      @custom-ahp-item-edit-clicked="showEditCustomAhpModal"
      @custom-ahp-deleted="reloadData"
      @custom-ahp-item-changed="reloadData"
    />
    <AddCustomAhp @custom-ahp-added="reloadData" />
    <EditCustomAhp
      :edited-custom-ahp="editedCustomAhp"
      @custom-ahp-updated="reloadData"
    />
    <FloatingActionButton @click="showCustomAhpModal" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import AhpItem from '../../../../components/Project/Rab/AhpItem.vue';
  import AddCustomAhp from './../../../../components/Project/Rab/AddCustomAhp.vue';
  import EditCustomAhp from './../../../../components/Project/Rab/EditCustomAhp.vue';
  import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';

  export default {
    created() {
      this.getCustomAhp();
    },
    data() {
      return {
        customAhps: [],
        editedCustomAhp: {},
      };
    },
    methods: {
      ...mapActions(['fetchCustomAhp']),
      async getCustomAhp() {
        const data = await this.fetchCustomAhp(this.$route.params.id);
        this.customAhps = data.data.data.customAhps;
      },
      showCustomAhpModal() {
        this.$bvModal.show('add-custom-ahp-modal');
      },
      reloadData() {
        this.getCustomAhp();
      },
      showEditCustomAhpModal(e) {
        this.editedCustomAhp = e;
        this.$bvModal.show('update-custom-ahp-modal');
      },
    },
    computed: {
      ...mapGetters(['getUnit']),
    },
    components: {
      AhpItem,
      FloatingActionButton,
      AddCustomAhp,
      EditCustomAhp,
    },
  };
</script>
