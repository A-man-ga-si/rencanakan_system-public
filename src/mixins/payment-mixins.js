import { mapActions } from "vuex";

export default {
    data() {
        return {
            paymentLoading: false,
        }
    },
    methods: {
        ...mapActions(['fetchSnapToken', 'setPending']),
        async pay(payload, onSuccessCallback = () => {}) {
            this.paymentLoading = true;
            const { data } = await this.fetchSnapToken(payload);
            const that = this;
            window.snap.pay(data.data.token, {
                onSuccess: async () => {
                    await this.setPending({
                        snapToken: data.data.token,
                    });
                    onSuccessCallback();
                },
                skipOrderSummary: false,
            });
            // this.paymentLoading = false;
        },
    }
}