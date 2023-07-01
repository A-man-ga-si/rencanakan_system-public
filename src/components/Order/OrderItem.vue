<template>
    <b-col lg="6">
        <b-card class="mb-4 pt-4">
            <div class="d-flex justify-content-between">
                <div class="left">
                    <!-- <h3 class="font-weight-bold"># {{ processedOrder?.order_id }} </h3> -->
                    <!-- <h4>Export RAB - {{ `${(processedOrder?.project?.name) || '-'} (${processedOrder?.project?.address ||
                        '-'})` }}</h4>
                    <h5>Rp. {{ processedOrder?.gross_amount_formatted }}</h5> -->
                </div>
                <!-- <div class="right text-right">
                    <h5>{{ processedOrder?.date_formatted?.date }} | {{ processedOrder?.date_formatted?.time }}</h5>
                    <h5 class="mt-3">
                        <b-badge :variant="statusVariant.color">{{ statusVariant.status }}</b-badge>
                    </h5>
                </div> -->
            </div>
            <div class="bottom-btn mt-4 text-right">
                <div class="success-action" v-if="processedOrder.status == 'completed' && !processedOrder.used_at">
                    <hr>
                    <b-btn v-if="getCompany" variant="primary" @click="submitExport">Download Excel</b-btn>
                    <span v-else><router-link :to="{ name: 'CompanyProfile' }"><u>Isi company</u></router-link> terlebih
                        dahulu untuk export</span>
                    <!-- <b-btn>Cetak Invoice</b-btn> -->
                </div>
                <div class="success-action" v-else-if="processedOrder.status == 'waiting_for_payment'">
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
        async submitExport() {
            const xlsxBlob = await this.exportProject({
                projectId: this.order.hashed_project_id,
            });
            const fileLink = document.createElement('a');
            fileLink.href = window.URL.createObjectURL(xlsxBlob);
            fileLink.download = this.getCompany.name + '.xlsx';
            fileLink.click();
            this.$emit('request-reload');
        }
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
            if (order.used_at) {
                variant = {
                    color: 'primary',
                    status: 'Sudah di Export',
                }
            } else {
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
                            status: 'Lunas',
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
            }
            return variant;
        },
    }
}
</script>