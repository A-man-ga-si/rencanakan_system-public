import ApiTwo from '../../services/ApiTwo.service';
import unitModule from './master/unit.module'

const customItemPriceApi = new ApiTwo({
  basePath: 'custom-item-price',
});

const customItemPriceGroupApi = new ApiTwo({
  basePath: 'custom-item-price-group',
});

const state = {
  customItemPrice: [],
};

const getters = {
  getCustomItemPrice: state => state.customItemPrice,
};

const mutations = {
  setCustomItemPrice(state, customItemPrices) {
    state.customItemPrice = customItemPrices;
  },
  updateCustomItemPrice(state, { customItemPriceId, form }) {
    loopCustomItemPrice(state.customItemPrice, customItemPrice => {
      if (customItemPrice.hashid == customItemPriceId) {
        customItemPrice.name = form.name
        customItemPrice.unit = unitModule.state.units.filter(unit => unit.hashid == form.unit_id)[0] // Find unit based on hashid
        customItemPrice.code = form.code
        customItemPrice.price = Number(form.price)
      }
    })
  },
  deleteCustomItemPrice(state, customItemPriceId) {
    loopCustomItemPrice(state.customItemPrice, (customItemPrice, groupIndex, customItemPriceIndex) => {
      if (customItemPriceId == customItemPrice.hashid) {
        delete state.customItemPrice[groupIndex].custom_item_price[customItemPriceIndex]
      }
    })
  },
  clearCustomItemPrice(state) {
    state.customItemPrice = [];
  },
};

const actions = {
  flushCustemItemPrices({ commit }) {
    commit('clearCustomItemPrice');
  },

  // prettier-ignore
  async fetchCustomItemPrices({ commit, state }, projectId) {
    const data = await customItemPriceGroupApi.setPreviousPath(`project/${projectId}`).get();
    commit('setCustomItemPrice', data.data.data.customItemPriceGroups);
    return data;
  },

  async queryCustomItemPrices({ commit }, { projectId, queries = {}}) {
    const data = await customItemPriceGroupApi.setPreviousPath(`project/${projectId}`).get('query/', encodeURI(`q=${queries.searchQuery}&category=${queries.searchQueryCategory}`));
    commit('setCustomItemPrice', data.data.data.result);
    return data;
  },

  // prettier-ignore
  async storeCustomItemPrice({ commit }, { projectId, form }) {
    return await customItemPriceApi.setPreviousPath(`project/${projectId}`).post('', form);
  },

  // prettier-ignore
  async deleteCustomItemPrice({ commit }, { projectId, customItemPriceCode }) {
    commit('deleteCustomItemPrice', customItemPriceCode)
    return await customItemPriceApi.setPreviousPath(`project/${projectId}`).get(`${customItemPriceCode}/delete`);
  },

  // prettier-ignore
  async customItemPricePartialUpdate({ commit, state }, { projectId, customItemPriceId, form }) {

    // ctx.

    // console.log(form)
    // console.log(ctx.state.customItemPrice)
    commit('updateCustomItemPrice', { customItemPriceId, form })
    return await customItemPriceApi.setPreviousPath(`project/${projectId}`).post(customItemPriceId, form);
  },
};

function loopCustomItemPrice(customItemPrice, callback) {
  for (const [i, customItemPriceGroup] of customItemPrice.entries()) {
    for (const [j, customItemPrice] of customItemPriceGroup.custom_item_price.entries()) {
      callback(customItemPrice, i, j)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
};
