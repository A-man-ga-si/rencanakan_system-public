<template>
  <div>
    <b-row class="">
      <b-col :lg="6" :xl="3">
        <div class="text-right mb-2 position-relative">
          <label class="form-group has-float-label mb-0">
            <input type="text" class="form-control" />
            <span> Search Item </span>
          </label>
          <i
            class="simple-icon-magnifier position-absolute bg-white"
            style="top: 11px; right: 10px"
          />
        </div>
      </b-col>
    </b-row>
    <ItemPriceItem />
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
