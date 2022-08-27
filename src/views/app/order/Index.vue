<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Orders" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 py-4">
            <h2 class="mb-5">Riwayat Order</h2>
            <b-row v-if="getOrders.length > 0">
                <OrderItem v-for="(order, key) in getOrders" :key="key" :order="order" @request-reload="fetchOrders" />
            </b-row>
            <div class="empty-view text-center w-100" v-else>
                <img src="@/assets/img/custom/worried.svg" alt="" width="400">
                <h2 class="font-weight-bold">Tidak Ada Riwayat Order</h2>
            </div>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
  import OrderItem from '@/components/Order/OrderItem.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    created() {
        this.fetchOrders();
    },
    methods: {
        ...mapActions(['fetchOrders']),
    },
    computed: {
        ...mapGetters(['getOrders']),
    },
    components: {
      OrderItem
    },
  };
</script>
