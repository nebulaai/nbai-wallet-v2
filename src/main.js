// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import Vuex from 'vuex'
import store from './store'
import i18n from './lang' // Language pack

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import localeCN from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'; // Default theme
// import './assets/css/theme-green/index.css'; // Light green theme
import './assets/css/icon.css';
import './assets/css/main.css';

import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Router);
Vue.use(ElementUI, { locale })
let langNew = store.getters.language == 'en'?{ locale }:{ localeCN }
Vue.use(ElementUI, langNew)
// Vue.use(ElementUI);
Vue.use(Vuex)

Vue.config.productionTip = false

import './utils/web3.1.min.js';
import Web3 from 'web3'
Vue.prototype.Web3 = Web3

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store,
  i18n,
  data: function(){
      return {
        networkUrl: process.env.BASE_NETWORK
      }
  }
})
