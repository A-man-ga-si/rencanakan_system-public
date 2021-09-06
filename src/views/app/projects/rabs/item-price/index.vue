<template>
  <div class="ahs-page">
    <b-nav class="mb-5 mt-2" pills>
      <b-nav-item :to="{ name: 'RabItemPriceMaster' }">
        {{ $t('pages.projects.rab.item-price-master-tab') }}
      </b-nav-item>
      <b-nav-item :to="{ name: 'RabEquipmentPriceMaster' }">
        {{ $t('pages.projects.rab.ahp-master-tab') }}
      </b-nav-item>
    </b-nav>
    <router-view />
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
