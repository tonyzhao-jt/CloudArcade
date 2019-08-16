import Vue from 'vue'
import Router from 'vue-router'
import MainApp from '@/components/AppMain'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainApp',
      component: MainApp
    }
  ]
})
