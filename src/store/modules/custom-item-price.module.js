import ApiTwo from '../../services/ApiTwo.service';
import unitModule from './master/unit.module'
import globalModule from './global.module'

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
    try {
      commit('deleteCustomItemPrice', customItemPriceCode)
      globalModule.state.isSyncroning = true
      return await customItemPriceApi.setPreviousPath(`project/${projectId}`).get(`${customItemPriceCode}/delete`);
    } catch (err) {
      throw err
    } finally {
      globalModule.state.isSyncroning = false
    }
  },

  // prettier-ignore
  async customItemPricePartialUpdate({ commit, state }, { projectId, customItemPriceId, form }) {
    try {
      commit('updateCustomItemPrice', { customItemPriceId, form })
      globalModule.state.isSyncroning = true
      const data = await customItemPriceApi.setPreviousPath(`project/${projectId}`).post(customItemPriceId, form);
      return data
    } catch (err) {
      throw err
    } finally {
      globalModule.state.isSyncroning = false
    }
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
