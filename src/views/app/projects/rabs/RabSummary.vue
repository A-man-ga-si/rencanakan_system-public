<template>
  <div class="rab-summary-page mt-5">
    <RabSummaryItem
      v-for="(rab, idx) in getRabs"
      :key="idx"
      :index="idx"
      :rab-item="rab"
      :ahs-code-list="customAhsIds"
      :unit-code-list="getUnit"
      @rab-item-deleted="reloadData"
      @rab-item-added="reloadData"
      @rab-item-updated="reloadData"
      @add-rab-item-header-bt-clicked="showAddRabItemHeaderModal"
    />
    <FloatingActionButton @click="fabClick" />
    <AddRab @rab-added="reloadData" />
    <AddRabItemHeader
      :rab="rabItemHeaderAdd"
      @rab-item-header-added="reloadData"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import RabSummaryItem from '../../../../components/Project/Rab/RabSummaryItem.vue';
  import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';
  import AddRab from './../../../../components/Project/Rab/AddRab.vue';
  import AddRabItemHeader from '@/components/Project/Rab/AddRabItemHeader.vue';

  export default {
    data() {
      return {
        projectProperties: {},
        projects: {},
        ahsCodesList: [],
        unitCodesList: [],
        customAhsIds: [],
        rabItemHeaderAdd: {},
      };
    },
    created() {
      this.fetchRab(this.$route.params.id);
      this.fetchShowProject();
      this.fetchUnit();
      this.getCustomAhsIds();
    },
    methods: {
      ...mapActions([
        'fetchUnit',
        'fetchCustomAhsIds',
        'fetchRab',
        'fetchAhs',
        'showProject',
      ]),
      async fetchShowProject() {
        this.projectProperties = await this.showProject(this.$route.params.id);
      },
      async getCustomAhsIds() {
        const data = await this.fetchCustomAhsIds({
          projectId: this.$route.params.id,
        });
        this.customAhsIds = data.data.data.ahsItemIds;
      },
      showAddRabItemHeaderModal(rabItem) {
        console.log(rabItem);
        this.rabItemHeaderAdd = rabItem;
        this.$bvModal.show('add-rab-item-header');
      },
      fabClick(ref) {
        this.$bvModal.show('add-rab');
      },
      reloadData() {
        this.fetchRab(this.$route.params.id);
      },
    },
    computed: {
      ...mapGetters(['getRabs', 'getAhs', 'getProjects', 'getUnit']),
    },
    components: {
      RabSummaryItem,
      FloatingActionButton,
      AddRab,
      AddRabItemHeader,
    },
  };
</script>
