import Vue from 'vue';
import Vuex from 'vuex';
import app from '../main';
import auth from './modules/auth.module';
import menu from './modules/menu.module';
import user from './modules/user.module';
import province from './modules/province.module';
import project from './modules/project.module';
import payment from './modules/payment.module';
import company from './modules/company.module';
import unit from './modules/master/unit.module';
import itemPrice from './modules/master/item-price.module';
import itemPriceGroup from './modules/master/item-price-group.module';
import ahs from './modules/master/ahs.module';
import ahsItem from './modules/master/ahs-item.module';
import ahp from './modules/master/ahp.module';
import rab from './modules/rab.module';
import customItemPrice from './modules/custom-item-price.module';
import customItemPriceGroup from './modules/custom-item-price-group.module';
import customAhp from './modules/custom-ahp.module';
import customAhs from './modules/custom-ahs.module';
import customAhsItem from './modules/custom-ahs-item.module';
import rabItem from './modules/rab-item.module';
import rabItemHeader from './modules/rab-item-header.module';
import order from './modules/order.module';
import tutorial from './modules/tutorials.module';
import global from './modules/global.module'
import subscription from './modules/subscription.module'
import implementationScheduleModule from './modules/implementation-schedule.module';
import masterRabModule from './modules/master/rab.module';
import masterRabItemModule from './modules/master/rab-item.module'
import masterRabItemHeaderModule from './modules/master/rab-item-header.module'
import { setCurrentLanguage } from '../utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    changeLang(state, payload) {
      app.$i18n.locale = payload;
      setCurrentLanguage(payload);
    },
  },
  actions: {
    setLang({ commit }, payload) {
      commit('changeLang', payload);
    },
  },
  modules: {
    menu,
    user,
    province,
    project,
    payment,
    company,
    auth,
    unit,
    ahs,
    ahp,
    itemPrice,
    itemPriceGroup,
    ahsItem,
    rab,
    customItemPrice,
    customItemPriceGroup,
    customAhp,
    customAhs,
    customAhsItem,
    rabItem,
    rabItemHeader,
    order,
    tutorial,
    global,
    subscription,
    implementationScheduleModule,
    masterRabModule,
    masterRabItemModule,
    masterRabItemHeaderModule
  },
});
