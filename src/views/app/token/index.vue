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
              {{ currentUserToken }}
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
              <PriceCard
                ref="price-card"
                @choose="choose"
                @unchoose="unchoose"
                :data="item"
                :index="pIndex"
                :id="`token-${item.id}`"
              />
            </b-colxx>
          </b-row>
        </b-card>
        <b-card>
          <b-card-title>
            <h5 class="font-weight-bold mb-4">Plan Summary</h5>
          </b-card-title>
          <ul class="p-0 pricing-list mb-0" v-if="selectedItems.length">
            <li
              class="p-0 d-flex justify-content-between"
              v-for="(selectedPackage, idx) in selectedItems"
              :key="idx"
            >
              <p class="font-weight-bold">{{ selectedPackage.title }}</p>
              <p class="font-weight-bold">{{ selectedPackage.price }}</p>
            </li>
          </ul>
          <p v-else>No Item Selected</p>
          <hr class="mt-0" />
          <div class="d-flex justify-content-between">
            <h5 class="font-weight-bold">Total</h5>
            <h5 class="font-weight-bold">{{ subtotal }}</h5>
          </div>
        </b-card>
        <b-card @click.prevent="checkoutToken" class="mt-3 text-right">
          <b-btn variant="primary">Checkout</b-btn>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import PriceCard from './../../../containers/pages/PriceCard';
  import AppLayout from './../../../layouts/AppLayout.vue';
  import { Notify } from 'notiflix';

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
            priceRaw: 100000,
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
            price: 'Rp. 150,000',
            priceRaw: 150000,
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
            price: 'Rp. 200,000',
            priceRaw: 200000,
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
            price: 'Rp. 250,000',
            priceRaw: 250000,
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
      selectedItems: [],
    }),
    mounted() {},
    methods: {
      ...mapActions(['fetchSnapToken', 'demoAddToken', 'mutateToken']),
      choose({ data, index }) {
        this.selectedItems.push(data);
      },
      unchoose({ data, index }) {
        this.selectedItems = this.selectedItems.filter(
          selData => selData.id != data.id
        );
      },
      async checkoutToken() {
        const { data } = await this.fetchSnapToken(this.selectedItems);
        window.snap.pay(data.data.token, {
          onSuccess: this.onPaymentSuccess,
        });
      },
      async onPaymentSuccess() {
        // Update token
        const { data } = await this.demoAddToken(
          this.selectedItems
            .map(el => el.value)
            .reduce((acc, curr) => parseInt(acc) + parseInt(curr))
        );
        await this.mutateToken(data.data.current_token_amount);
        this.resetTokenCart();
        Notify.success('Berhasil melakukan pembelian token');
      },
      resetTokenCart() {
        this.selectedItems = [];
        for (const pc of this.$refs['price-card']) pc.choose = false;
      },
    },
    computed: {
      ...mapGetters(['currentUser']),
      subtotal() {
        if (this.selectedItems.length) {
          const formatter = new Intl.NumberFormat('id');
          return `Rp. ${formatter.format(
            this.selectedItems
              .map(data => data.priceRaw)
              .reduce((acc, curr) => acc + curr)
          )}`;
        } else {
          return `Rp. 0`;
        }
      },
      currentUserToken() {
        const formatter = new Intl.NumberFormat('id');
        return formatter.format(this.currentUser.token_amount);
      },
    },
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
