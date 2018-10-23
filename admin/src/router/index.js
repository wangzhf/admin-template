import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import CommonRouter from './common'

// import SystemRouter from './system/index'

export const constantRouterMap = [
  ...CommonRouter
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  // 系统管理
  // SystemRouter,

  { path: '*', redirect: '/404', hidden: true }
]
