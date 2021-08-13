<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.token')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-3">
          <div class="d-flex justify-content-between">
            <h1 class="mb-0 pb-0 font-weight-bold">Saldo Saya</h1>
            <h1 class="mb-0 pb-0 font-weight-bold">
              <i class="iconsminds-coins-2"></i>
              1,000
            </h1>
          </div>
        </b-card>
        <b-card class="mb-4">
          <b-row class="equal-height-container mb-5">
            <b-colxx xxs="12">
              <b-card-title class="font-weight-bold">
                {{ $t('pages.prices.pricecomparison') }}
              </b-card-title>
            </b-colxx>
            <b-colxx
              v-for="(item, pIndex) in pricings.en"
              md="12"
              lg="3"
              class="col-item mb-4"
              :key="`price_${pIndex}`"
            >
              <PriceCard :data="item" :id="`token-${item.id}`" />
            </b-colxx>
          </b-row>
        </b-card>
        <b-card>
          <b-card-title>
            <h5 class="font-weight-bold mb-4">Plan Summary</h5>
          </b-card-title>
          <ul class="p-0 pricing-list mb-0">
            <li class="p-0 d-flex justify-content-between">
              <p class="font-weight-bold">Starter Package (5 Token)</p>
              <p class="font-weight-bold">Rp. 50,000</p>
            </li>
            <li class="p-0 d-flex justify-content-between">
              <p class="font-weight-bold">Starter Package (10 Token)</p>
              <p class="font-weight-bold">Rp. 70,000</p>
            </li>
          </ul>
          <hr class="mt-0" />
          <div class="d-flex justify-content-between">
            <h5 class="font-weight-bold">Total</h5>
            <h5 class="font-weight-bold">Rp. 120,000</h5>
          </div>
        </b-card>
        <b-card class="mt-3 text-right">
          <b-btn variant="primary">Checkout</b-btn>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
  import PriceCard from './../../../containers/pages/PriceCard';
  import AppLayout from './../../../layouts/AppLayout.vue';

  export default {
    data: () => ({
      pricings: {
        en: [
          {
            icon: 'iconsminds-coins-2',
            id: 1,
            title: 'Starter',
            value: '5',
            price: 'Rp. 100,000',
            detail: 'User/Month',
            link: '#',
            features: [
              'Number of end products 1',
              'Free updates',
              'Forum support',
            ],
          },
          {
            icon: 'iconsminds-coins-2',
            id: 2,
            title: 'Save 10%',
            value: '10',
            price: 'Rp. 100,000',
            detail: 'User/Month Up to 10 Users',
            link: '#',
            features: [
              '24/5 support',
              'Number of end products 1',
              'Two factor authentication',
              'Free updates',
              'Forum support',
            ],
          },
          {
            icon: 'iconsminds-coins-2',
            id: 3,
            title: 'Save 20%',
            value: '20',
            price: 'Rp. 100,000',
            detail: 'User/Month 10+ Users',
            link: '#',
            features: [
              '24/7 support',
              'Number of end products 1',
              'Two factor authentication',
              'Free updates',
              'Forum support',
            ],
          },
          {
            icon: 'iconsminds-coins-2',
            id: 4,
            title: 'Best Deal',
            value: '50',
            price: 'Rp. 100,000',
            detail: 'User/Month 10+ Users',
            link: '#',
            features: [
              '24/7 support',
              'Number of end products 1',
              'Two factor authentication',
              'Free updates',
              'Forum support',
            ],
          },
        ],
      },
    }),
    components: {
      AppLayout,
      PriceCard,
    },
  };
</script>

<style scoped>
  .pricing-list {
    list-style-type: none;
  }
</style>
