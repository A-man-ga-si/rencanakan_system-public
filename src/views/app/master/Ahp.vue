<template>
  <div class="master-ahp">
    <h3 class="mb-4">Master AHP</h3>
    <AhpItem
      v-for="(ahp, idx) in getAhp"
      :key="idx"
      :ahp-item="ahp"
      @ahp-deleted="reloadAhp"
      @ahp-item-changed="reloadAhp"
      @ahp-item-edit-clicked="editAhp"
    />
    <FloatingActionButton v-b-modal.add-ahp-modal />
    <AddAhp @ahp-added="reloadAhp" />
    <EditAhp :selected-ahp="selectedAhp" @ahp-updated="reloadAhp" />
  </div>
</template>

<script>
  import FloatingActionButton from '@/components/Project/FloatingActionButton.vue';
  import AddAhp from '@/components/Master/Ahp/AddAhp.vue';
  import EditAhp from '@/components/Master/Ahp/EditAhp.vue';
  import AhpItem from '@/components/Master/Ahp/AhpItem.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data: () => ({
      selectedAhp: {},
    }),
    mounted() {
      this.fetchAhp();
    },
    methods: {
      ...mapActions(['fetchAhp']),
      reloadAhp() {
        this.fetchAhp();
      },
      editAhp(ahp) {
        this.selectedAhp = ahp;
      },
    },
    computed: {
      ...mapGetters(['getAhp']),
    },
    components: {
      FloatingActionButton,
      AddAhp,
      AhpItem,
      EditAhp,
    },
  };
</script>
