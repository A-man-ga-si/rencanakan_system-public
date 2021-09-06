<template>
  <div class="rab-summary-page mt-5">
    <RabSummaryItem />
    <RabSummaryItem />
    <FloatingActionButton @click="fabClick" />
  </div>
</template>

<script>
  import RabSummaryItem from '../../../../components/Project/Rab/RabSummaryItem.vue';
  import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';

  export default {
    mounted() {},
    methods: {
      fabClick(ref) {
        alert('Hello World');
        console.log(ref);
      },
    },
    components: {
      RabSummaryItem,
      FloatingActionButton,
    },
  };
</script>
