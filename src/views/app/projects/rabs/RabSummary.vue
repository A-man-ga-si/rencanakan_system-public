<template>
  <div class="rab-summary-page mt-5">
    <RabSummaryItem
      v-for="(rab, idx) in getRabs"
      :key="idx"
      :index="idx"
      :rab-item="rab"
    />
    <FloatingActionButton @click="fabClick" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import RabSummaryItem from '../../../../components/Project/Rab/RabSummaryItem.vue';
  import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';

  export default {
    created() {
      this.fetchRab(this.$route.params.id);
    },
    methods: {
      ...mapActions(['fetchRab']),
      fabClick(ref) {
        alert('Hello World');
      },
    },
    computed: {
      ...mapGetters(['getRabs']),
    },
    components: {
      RabSummaryItem,
      FloatingActionButton,
    },
  };
</script>
