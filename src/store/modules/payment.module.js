import { setTokenAmount } from '../../utils';
import { postPayment } from '../../services/payment.service';

const state = {};

const actions = {
  fetchSnapToken(ctx, data) {
    return postPayment('fetch-snap-token', {
      carts: data,
    });
  },
  // NOTE: For demo purpose only !
  async demoAddToken(ctx, tokenAmount) {
    const res = await postPayment('demo-add-token', {
      token_amount: tokenAmount,
    });
    setTokenAmount(res.data.data.current_token_amount);
    return res;
  },
};

const getters = {};

export default {
  state,
  actions,
  getters,
};
