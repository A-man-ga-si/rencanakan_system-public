import {
  postCustomItemPriceGroup,
  getCustomItemPriceGroup,
} from '../../services/custom-item-price-group.service';

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
  async destroyCustomItemPriceGroup(
    ctx,
    { projectId, customItemPriceGroupId }
  ) {
    await getCustomItemPriceGroup(
      `project/${projectId}/custom-item-price-group/${customItemPriceGroupId}/delete`
    );
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
