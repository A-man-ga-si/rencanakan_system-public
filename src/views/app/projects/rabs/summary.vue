<template>
  <div class="rab-summary-page mt-5">
    <button class="floating-action-button bg-primary border-0 rounded-circle">
      <i class="iconsmind iconsminds-add m-0"></i>
    </button>
    <RabSummaryItem />
    <RabSummaryItem />
  </div>
</template>

<script>
  import RabSummaryItem from './../../../../components/Project/Rab/RabSummaryItem.vue';

  export default {
    mounted() {},
    components: {
      RabSummaryItem,
    },
  };
</script>

<style scoped>
  .floating-action-button {
    position: fixed;
    right: 60px;
    bottom: 46px;
    width: 60px;
    height: 60px;
    font-size: 30px;
    z-index: 99;
  }
</style>
