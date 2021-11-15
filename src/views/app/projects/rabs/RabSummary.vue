<template>
  <div class="rab-summary-page mt-5">
    <RabSummaryItem
      v-for="(rab, idx) in getRabs"
      :key="idx"
      :index="idx"
      :rab-item="rab"
      :ahs-code-list="ahsCodesList"
      :unit-code-list="unitCodesList"
    />
    <FloatingActionButton @click="fabClick" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import RabSummaryItem from '../../../../components/Project/Rab/RabSummaryItem.vue';
  import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';

  export default {
    data() {
      return {
        projectProperties: {},
        projects: {},
        ahsCodesList: [],
        unitCodesList: [],
      };
    },
    created() {
      this.fetchRab(this.$route.params.id);
      this.fetchShowProject();
    },
    methods: {
      ...mapActions(['fetchRab', 'fetchAhs', 'showProject']),
      async fetchShowProject() {
        this.projectProperties = await this.showProject(this.$route.params.id);
      },
      fabClick(ref) {
        alert('Hello World');
      },
    },
    computed: {
      ...mapGetters(['getRabs', 'getAhs', 'getProjects']),
    },
    components: {
      RabSummaryItem,
      FloatingActionButton,
    },
  };
</script>
