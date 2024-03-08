import { getToken, setTokenAmount } from '../../utils';
import ApiTwo from '../../services/ApiTwo.service';
import axios from 'axios';
import { apiUrl } from '../../constants/config';

const state = {};

const paymentApi = new ApiTwo({
  basePath: 'payment',
});

const actions = {
  async fetchSnapToken(ctx, data) {
    return await paymentApi.post('fetch-snap-token', data);
  },

  async fetchSubscriptionSnapToken(ctx, data) {
    return await paymentApi.post('fetch-subscription-snap-token', data)
  },

  async setCanceled(ctx, data) {
    return await paymentApi.post('set-canceled', data)
  },

  async setPending(ctx, { snapToken }) {
    const res = await paymentApi.post('set-pending', { snapToken });
  },

  // NOTE: For demo purpose only !
  async demoAddToken(ctx, tokenAmount) {
    const res = await paymentApi.post('demo-add-token', {
      token_amount: tokenAmount,
    });
    setTokenAmount(res.data.data.current_token_amount);
    return res;
  },

  // FIXME: Move to order module !
  async checkOrder(ctx, { projectId }) {
    const res = await axios.post(
      `${apiUrl}/order/by-project/${projectId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return res;
  },
};

const getters = {};

export default {
  state,
  actions,
  getters,
};
