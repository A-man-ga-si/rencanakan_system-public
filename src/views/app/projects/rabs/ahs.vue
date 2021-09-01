<template>
  <div class="ahs-page mt-5">
    <FloatingActionButton />
    <AhsItem />
  </div>
</template>

<script>
  import AhsItem from './../../../../components/Project/Rab/AhsItem.vue';
  import FloatingActionButton from './../../../../components/Project/FloatingActionButton.vue';

  export default {
    components: {
      AhsItem,
      FloatingActionButton,
    },
  };
</script>
