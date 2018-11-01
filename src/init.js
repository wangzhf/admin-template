import { getAllMenu } from '@/api/login'
import _ from 'lodash'
// const _import = require('./utils/_import_' + process.env.NODE_ENV)
const _import = require('./utils/_import')

/**
 * 根据菜单生成对应路由
 * @param {*} menus
 */
function generateRouter(menus, parentPath) {
  const asyncRouters = []
  if (menus && menus.length > 0) {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i]
      const route = {}
      route.path = parentPath + menu.path
      route.name = menu.menuName
      route.authority = _.lowerFirst(menu.menuCode)
      route.meta = {}
      route.meta.title = _.lowerFirst(menu.menuCode)
      route.meta.icon = menu.icon
      // refer: https://github.com/vuejs/vue-loader/releases/tag/v13.0.0
      route.component = _import(menu.component)
      // route.component = require('./' + menu.component).default
      // route.component = () => import('@/views' + menu.component + '.vue').then(m => m.default)
      if (menu.children && menu.children.length > 0) {
        route.redirect = route.path + menu.children[0].path
        // 防止单个子节点时不显示父菜单
        route.alwaysShow = true
        route.children = generateRouter(menu.children, route.path)
      }
      asyncRouters.push(route)
    }
  }

  return asyncRouters
}

export const handleRouter = () => {
  return getAllMenu().then(res => {
    const menus = res.data
    const asyncRouterList = generateRouter(menus, '')
    return asyncRouterList
  }).catch(error => {
    console.log('error from init: ')
    console.log(error)
  })
}

