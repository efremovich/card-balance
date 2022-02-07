import Vue from 'vue';
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue';
import VueCompositionAPI from '@vue/composition-api';
import excel from 'vue-excel-export';
import VueHtmlToPaper from 'vue-html-to-paper';
import VueResource from 'vue-resource';

import router from './router';
import store from './store';
import App from './App.vue';

// Global Components
import './libs/global-components';

// 3rd party plugins
import '@axios';
import '@/libs/acl';
import '@/libs/portal-vue';
import '@/libs/clipboard';
import '@/libs/toastification';
import '@/libs/sweet-alerts';
import '@/libs/vue-select';
import '@/libs/tour';

const options = {
  'name': '_blank',
  'specs': [
    'fullscreen=no',
    'titlebar=yes',
    'scrollbars=no',
  ],
  'styles': [
    'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css',
    '../src/assets/scss/components/checks.scss',

  ],
};

Vue.use(excel);
Vue.use(VueResource);
// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);
Vue.use(VueHtmlToPaper, options);
// Vue.use(VueExcelXlsx);

// Composition API
Vue.use(VueCompositionAPI);

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css'); // For form-wizard
// import core styles
require('@core/scss/core.scss');

// import assets styles
require('@/assets/scss/style.scss');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
