import { postCustomItemPriceGroup } from '../../services/custom-item-price-group.service';

const state = {};

const getters = {};

const mutations = {};

const actions = {
  async storeCustomItemPriceGroup(ctx, { projectId, form }) {
    const data = await postCustomItemPriceGroup(
      `project/${projectId}/custom-item-price-group`,
      form
    );
    return data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
