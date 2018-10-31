import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// font awesome 5
import '@/styles/fontawesome5.scss'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import { asyncRouterMap } from './router'
import store from './store'

import i18n from './lang' // Internationalization
// import './icons' // icon
// use font awesome
import '@/components/FAIcon'
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: Cookies.get('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

import { handleRouter } from './init'

handleRouter().then((res) => {
  for (let i = 0; i < res.length; i++) {
    asyncRouterMap.splice(i, 0, res[i])
  }
  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
  })
})

