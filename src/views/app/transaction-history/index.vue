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
        <b-card class="mb-4">
          <b-row class="equal-height-container mb-5">
            <b-colxx xxs="12">
              <b-card-title class="font-weight-bold">
                Riwayat Transaksi
              </b-card-title>
            </b-colxx>
          </b-row>
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
