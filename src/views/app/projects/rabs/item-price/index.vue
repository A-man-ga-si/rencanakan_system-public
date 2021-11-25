<template>
  <div class="ahs-page">
    <div class="mt-5">
      <router-view />
    </div>
  </div>
</template>

<script>
  import ItemPriceItem from './../../../../../components/Project/Rab/ItemPriceItem.vue';

  export default {
    components: {
      ItemPriceItem,
    },
  };
</script>
