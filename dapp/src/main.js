// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/'
import 'font-awesome/css/font-awesome.css'
import './ele-theme/theme/index.css'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import VueSocketIO from 'vue-socket.io'

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://127.0.0.1:3000'
}))
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
