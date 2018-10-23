import { asyncRouterMap, constantRouterMap } from '@/router'
import { getAllMenu } from '@/api/login'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(menus, route) {
  if (route.authority) {
    if (menus[route.authority] !== undefined) {
      return menus[route.authority]
    } else {
      return false
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus, menuDatas) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (menuDatas[route.authority]) {
        const r = menuDatas[route.authority]
        route.name = r.menuName
        route.icon = r.icon
        // 覆盖meta中信息
        route.meta.title = r.menuCode
        route.meta.icon = r.icon
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus, menuDatas)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      console.log('all router: ')
      console.log(state.routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, menus) {
      return new Promise(resolve => {
        getAllMenu().then(res => {
          const data = res.data
          const menuDatas = {}
          for (let i = 0; i < data.length; i++) {
            menuDatas[data[i].menuCode] = data[i]
          }
          const accessedRouters = filterAsyncRouter(asyncRouterMap, menus, menuDatas)
          console.log('accessRouters: ')
          console.log(accessedRouters)
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        })
      })
    }
  }
}

export default permission
