<template>
  <div class="batch-update-price-item-price">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.item-price.add-item-price')"
    >
      <div class="labeled-select position-relative mb-4">
        <span class="px-1"> Provinsi</span>
        <v-select
          label="name"
          :reduce="province => province.hashid"
          :options="provinces"
          id=""
          v-model="form.provinceId"
        />
      </div>
      <div class="labeled-select position-relative mb-4">
        <span class="px-1"> Harga Satuan</span>
        <v-select
          label="name"
          :reduce="itemPrice => itemPrice.id"
          :options="itemPrices"
          id=""
          v-model="form.itemPriceId"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    data: () => ({
      form: {
        provinceId: '',
        itemPriceId: '',
      },
      modalId: 'batch-update-price-modal',
    }),
    props: ['provinces', 'itemPrices'],
    watch: {
      provinces() {
        if (this.provinces.length) {
          this.form.provinceId = this.provinces[0].hashid;
        }
      },
    },
  };
</script>
