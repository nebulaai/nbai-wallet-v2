// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import Vuex from 'vuex'
import store from './store'
import i18n from './lang' // 语言包

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import localeCN from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
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

Vue.prototype.network = 'https://api.nbai.io'
Vue.prototype.apiUrl = 'https://api1.nbai.io'
Vue.prototype.scanUrl = 'https://scan.nbai.io/#/'


import './utils/web3.1.min.js';
import Web3 from 'web3'
Vue.prototype.Web3 = Web3

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
      //这里判断用户是否登录，验证本地存储是否有token
      if (!localStorage.token) { // 判断当前的token是否存在
          next({
              path: '/login',
              query: { redirect: to.fullPath }
          })
      } else {
          next()
      }
  } else {
      next() // 确保一定要调用 next()
  }
  
  window.scrollTo(0,0);
})


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
