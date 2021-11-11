import Vue from 'vue';
import App from './App';

// BootstrapVue add
import BootstrapVue from 'bootstrap-vue';

// Router & Store add
import router from './router';
import store from './store';

// Multi Language Add
import VueI18n from 'vue-i18n';
import en from './locales/en.json';
import id from './locales/id.json';

// Notification Component Add
import Notifications from './components/Common/Notification';

// Breadcrumb Component Add
import Breadcrumb from './components/Common/Breadcrumb';

// RefreshButton Component Add
import RefreshButton from './components/Common/RefreshButton';

// Colxx Component Add
import Colxx from './components/Common/Colxx';

// Perfect Scrollbar Add
import vuePerfectScrollbar from 'vue-perfect-scrollbar';
import VueScrollTo from 'vue-scrollto';

import { getCurrentLanguage } from './utils';

import Notiflix from 'notiflix';
import vSelect from 'vue-select';

import 'vue-select/dist/vue-select.css';
import 'pace-js';
import 'pace-js/themes/blue/pace-theme-minimal.css';

Vue.use(BootstrapVue);
Vue.use(VueI18n);

Vue.component('v-select', vSelect);

const messages = { en: en, id: id };
const locale = getCurrentLanguage();

const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages,
});

Notiflix.Notify.init({
  fontFamily: 'roboto',
  cssAnimation: true,
  cssAnimationStyle: 'from-right',
});

Vue.use(Notifications);
Vue.use(VueScrollTo);

Vue.component('piaf-breadcrumb', Breadcrumb);
Vue.component('b-refresh-button', RefreshButton);
Vue.component('b-colxx', Colxx);
Vue.component('vue-perfect-scrollbar', vuePerfectScrollbar);

Vue.config.productionTip = false;

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
