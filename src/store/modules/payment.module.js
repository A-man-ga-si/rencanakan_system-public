import { setTokenAmount } from '../../utils';
import ApiTwo from '../../services/ApiTwo.service';

const state = {};

const paymentApi = new ApiTwo({
  basePath: 'payment',
});

const actions = {
  async fetchSnapToken(ctx, data) {
    return await paymentApi.post('fetch-snap-token', {
      carts: data,
    });
  },

  // NOTE: For demo purpose only !
  async demoAddToken(ctx, tokenAmount) {
    const res = await paymentApi.post('demo-add-token', {
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
