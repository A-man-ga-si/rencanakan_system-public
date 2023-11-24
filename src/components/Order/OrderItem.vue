<template>
    <b-col lg="6">
        <b-card class="mb-4">
            <div class="d-flex justify-content-between">
                <div class="left">
                    <h1 class="mb-0" v-if="processedOrder.project">{{ processedOrder.project.name  }}</h1>
                    <h1 class="mb-0" v-else>-</h1>
                    <p class="mt-0">{{ processedOrder.subscription_id }} subscription</p>
                    <h3>Rp. {{ processedOrder.formatted_gross_amount }}</h3>
                    <p class="m-0" v-if="processedOrder.payment_method">{{ processedOrder.payment_method }}</p>
                    <p class="m-0" v-else>-</p>
                </div>
                <div class="right text-right">
                    <h5 class="mb-1">{{ processedOrder.formatted_date  }}</h5>
                    <p class="font-weight-bold m-0"># {{ processedOrder.order_id }} </p>
                    <p class="mt-2">
                        <b-badge :variant="statusVariant.color">{{ statusVariant.status }}</b-badge>
                        <b-badge variant="primary" v-if="processedOrder.is_active == '1'">Langganan Aktif</b-badge>
                    </p>
                    <span v-if="processedOrder.expired_at">
                        <p class="mb-0">Kadaluwarsa : {{ processedOrder.formatted_expired_at }}</p>
                        <small class="text-danger" v-if="processedOrder.is_expired">Expired</small>
                    </span>
                </div>
                <!-- <div class="right text-right">
                    <h5>{{ processedOrder?.date_formatted?.date }} | {{ processedOrder?.date_formatted?.time }}</h5>
                </div> -->
            </div>
            <div class="bottom-btn mt-4 text-right" v-if="processedOrder.status == 'waiting_for_payment'">
                <div class="success-action">
                    <hr>
                    <b-btn @click="submitPayment">Lanjutkan Pembayaran</b-btn>
                </div>
            </div>
        </b-card>
    </b-col>
</template>

<script>

import { formatCurrency, formatDateString } from '@/utils';
import paymentMixins from '@/mixins/payment-mixins';
import { mapActions, mapGetters } from 'vuex';

export default {
    mixins: [paymentMixins],
    props: {
        order: {
            type: Object,
            required: true,
        }
    },
    methods: {
        ...mapActions(['exportProject']),
        async submitPayment() {
            const orderId = this.order.order_id;
            const that = this;
            await this.pay({
                order_id: orderId,
            }, function () {
                that.$emit('request-reload');
            });
        },
    },
    computed: {
        ...mapGetters(['getCompany']),
        processedOrder() {
            const order = this.order;
            order.gross_amount_formatted = formatCurrency(order.gross_amount);
            order.date_formatted = formatDateString(order.created_at);
            return order;
        },
        statusVariant() {
            const order = this.order;
            let variant = {};
            switch (order.status) {
                case 'waiting_for_payment':
                    variant = {
                        color: 'primary',
                        status: 'Menunggu Pembayaran',
                    };
                    break;
                case 'pending':
                    variant = {
                        color: 'warning',
                        status: 'Pending',
                    };
                    break;
                case 'completed':
                    variant = {
                        color: 'success',
                        status: 'Dibayar',
                    };
                    break;
                case 'canceled':
                    variant = {
                        color: 'danger',
                        status: 'Dibatalkan',
                    };
                    break;
                case 'expired':
                    variant = {
                        color: 'danger',
                        status: 'Dibatalkan',
                    };
                    break;
            }
            return variant;
        },
    }
}
</script>