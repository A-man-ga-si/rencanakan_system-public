<template>
  <div class="item-price">
    <div class="mb-3 d-flex justify-content-between">
      <div class="left">
        <div
          class="labeled-select position-relative d-inline-block"
          style="width: 300px"
        >
          <span class="px-1"> Provinsi</span>
          <v-select
            name=""
            :options="provinces"
            id=""
            v-model="form.selectedProvince"
          />
        </div>
      </div>
      <div class="right">
        <b-btn v-b-modal.add-item-price variant="primary">
          {{ $t('pages.master.item-price.add-item-price') }}
        </b-btn>
      </div>
    </div>
    <ItemPriceItem />
    <AddItemPrice />
    <EditItemPrice />
  </div>
</template>

<script>
  import ItemPriceItem from '@/components/Master/ItemPrice/ItemPriceItem.vue';
  import AddItemPrice from '@/components/Master/ItemPrice/AddItemPrice.vue';
  import EditItemPrice from '@/components/Master/ItemPrice/EditItemPrice.vue';
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import { mapActions } from 'vuex';

  export default {
    data: () => ({
      provinces: [],
      form: {
        selectedProvince: '',
        searchQuery: '',
      },
    }),
    created() {
      this.loadProvinces();
    },
    methods: {
      ...mapActions(['fetchProvinces']),
      async loadProvinces() {
        const data = await this.fetchProvinces();
        this.provinces = data.map(province => province.name);
        console.log(this.provinces);
      },
    },
    components: {
      ItemPriceItem,
      AddItemPrice,
      ValidationInput,
      EditItemPrice,
    },
  };
</script>
