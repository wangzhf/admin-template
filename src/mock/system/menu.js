import Mock from 'mockjs'

let menuList = [
  {
    id: 1,
    menuName: '首页',
    menuCode: 'dashBoard',
    type: 'menu',
    path: '/dashboard',
    icon: 'solid_home',
    component: '/layout/Layout',
    usable: 1,
    sort: 20,
    remarks: '',
    parentId: null
  },
  {
    id: 2,
    menuName: '系统管理',
    menuCode: 'system',
    type: 'menu',
    path: '/system',
    icon: 'solid_cog',
    component: '/layout/Layout',
    usable: 1,
    sort: 20,
    remarks: '',
    parentId: null,
    children: [
      {
        id: 3,
        menuName: '用户管理',
        menuCode: 'userManager',
        type: 'menu',
        path: '/user',
        icon: 'solid_user',
        component: '/system/user/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 2
      },
      {
        id: 4,
        menuName: '角色管理',
        menuCode: 'roleManager',
        type: 'menu',
        path: '/role',
        icon: 'solid_users',
        component: '/system/role/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 2
      },
      {
        id: 11,
        menuName: '菜单管理',
        menuCode: 'menuManager',
        type: 'menu',
        path: '/menu',
        icon: 'solid_bars',
        component: '/system/menu/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 2
      },
      // {
      //   id: 5,
      //   menuName: '资源管理',
      //   menuCode: 'resourceManager',
      //   type: 'menu',
      //   path: '/resource',
      //   icon: 'solid_warehouse',
      //   component: '/system/resource/index',
      //   usable: 1,
      //   sort: 20,
      //   remarks: '',
      //   parentId: 2
      // },
      {
        id: 6,
        menuName: '角色用户管理',
        menuCode: 'roleUserManager',
        type: 'menu',
        path: '/roleuser',
        icon: 'solid_user-friends',
        component: '/system/roleuser/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 2
      },
      {
        id: 7,
        menuName: '角色资源管理',
        menuCode: 'roleResourceManager',
        type: 'menu',
        path: '/roleresource',
        icon: 'solid_users-cog',
        component: '/system/roleresource/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 2
      }
    ]
  },
  {
    id: 13,
    menuName: '模板',
    menuCode: 'template',
    type: 'menu',
    path: '/template',
    icon: 'iconmoon_icon-insert-template',
    component: '/layout/Layout',
    usable: 1,
    sort: 20,
    remarks: '',
    parentId: null,
    children: [
      {
        id: 14,
        menuName: '表格样式',
        menuCode: 'table',
        type: 'menu',
        path: '/table',
        icon: 'solid_table',
        component: '/template/common/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 13
      }
    ]
  },
  {
    id: 17,
    menuName: '历史',
    menuCode: 'history',
    type: 'menu',
    path: '/history',
    icon: 'solid_history',
    component: '/layout/Layout',
    usable: 1,
    sort: 20,
    remarks: '',
    parentId: null,
    children: [
      {
        id: 18,
        menuName: '表格样式',
        menuCode: 'tableHistory',
        type: 'menu',
        path: '/table',
        icon: 'solid_table',
        component: '/history/table/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 17
      },
      {
        id: 19,
        menuName: 'Dialog',
        menuCode: 'dialogHistory',
        type: 'menu',
        path: '/dialog',
        icon: 'solid_table',
        component: '/history/dialog/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 17
      },
      {
        id: 21,
        menuName: 'Form',
        menuCode: 'formHistory',
        type: 'menu',
        path: '/form',
        icon: 'solid_table',
        component: '/history/form/index',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 17
      },
      {
        id: 28,
        menuName: 'FormValidation',
        menuCode: 'formValidation',
        type: 'menu',
        path: '/formvalidation',
        icon: 'solid_table',
        component: '/history/form/Validation',
        usable: 1,
        sort: 20,
        remarks: '',
        parentId: 17
      }
    ]
  }
]

// 存储角色菜单对应关系
const roleMenus = [{ id: 1, menus: [1] }]

export default {
  getAllMenu: config => {
    return menuList
  },
  editMenu: config => {
    const param = JSON.parse(config.body)
    menuList = updateList(param, menuList)
    return menuList
  },
  deleteMenu: config => {
    const { id } = JSON.parse(config.body)
    deleteList(id, menuList)
    return id
  },
  addMenu: config => {
    const param = JSON.parse(config.body)
    const minStep = Mock.Random.integer(1000)
    const newId = Mock.mock({ 'id|+1': minStep }).id
    param.id = newId
    menuList = addList(param, menuList)
    return param
  },
  batchDelete: config => {
    const { ids } = JSON.parse(config.body)
    const idArr = ids.split(',')
    for (let i = 0; i < idArr.length; i++) {
      deleteList(idArr[i], menuList)
    }
    return ids
  },

  getRoleMenuList: config => {
    const data = JSON.parse(config.body) || {}
    const id = data.id
    const ret = {}
    if (id) {
      roleMenus.filter(item => {
        if (id === item.id) {
          ret.menus = item.menus
        }
      })
    }
    ret.allMenus = menuList
    return ret
  },

  addRoleMenu: config => {
    const data = JSON.parse(config.body) || {}
    const menus = data.menus || []
    const id = data.id
    let match = false
    roleMenus.filter(roleMenu => {
      if (roleMenu.id === id) {
        roleMenu.menus = menus
        match = true
      }
    })
    if (!match) {
      menuList.push({
        id,
        menus
      })
    }
  }
}

function deleteList(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    const tar = arr[i]
    if (id === tar.id) {
      arr.splice(i, 1)
      return arr
    } else {
      if (tar.children && tar.children.length > 0) {
        const tmp = deleteList(id, tar.children)
        arr[i].children = tmp
        return arr
      }
    }
  }
  return []
}

function addList(obj, arr) {
  for (let i = 0; i < arr.length; i++) {
    const tar = arr[i]
    if (obj.parentId === tar.id) {
      if (tar.children && tar.children.length > 0) {
        tar.children.push(obj)
      } else {
        tar.children = [obj]
      }
      return arr
    } else {
      if (tar.children && tar.children.length > 0) {
        const tmp = addList(obj, tar.children)
        arr[i].children = tmp
        return arr
      }
    }
  }
  return []
}

function updateList(obj, arr) {
  for (let i = 0; i < arr.length; i++) {
    const tar = arr[i]
    if (obj.id === tar.id) {
      arr[i] = obj
      return arr
    } else {
      if (tar.children && tar.children.length > 0) {
        const tmp = updateList(obj, tar.children)
        arr[i].children = tmp
        return arr
      }
    }
  }
  return []
}
