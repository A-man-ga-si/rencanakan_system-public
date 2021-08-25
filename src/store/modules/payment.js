import axios from 'axios';
import { apiUrl } from '../../constants/config';
import { getToken, setTokenAmount } from '../../utils';

const state = {};

const actions = {
  fetchSnapToken(ctx, data) {
    return axios.post(
      `${apiUrl}/payment/fetch-snap-token`,
      {
        carts: data,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  },
  // NOTE: For demo purpose only !
  demoAddToken(ctx, tokenAmount) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${apiUrl}/payment/demo-add-token`,
          {
            token_amount: tokenAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then(resp => {
          setTokenAmount(resp.data.data.current_token_amount);
          resolve(resp);
        })
        .catch(reject);
    });
  },
};

const getters = {};

export default {
  state,
  actions,
  getters,
};
