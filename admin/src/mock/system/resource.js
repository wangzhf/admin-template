import Mock from 'mockjs'

let resourceList = [{ 'id': 52, 'parentId': null, 'sort': 0, 'name': '登录', 'code': '/login', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
  { 'id': 68, 'parentId': null, 'sort': 0, 'name': '仪表盘', 'code': '/index', 'type': 1, 'usable': '1', 'remarks': '', 'children': [] },
  { 'id': 69, 'parentId': null, 'sort': 0, 'name': '系统管理', 'code': '/sys', 'type': 1, 'usable': '1', 'remarks': '', 'children': [{ 'id': 82, 'parentId': 69, 'sort': 0, 'name': '资源管理', 'code': '/sys/resource', 'type': 1, 'usable': '1', 'remarks': '', 'children': [{ 'id': 99, 'parentId': 82, 'sort': 0, 'name': '/sys/resource/get', 'code': '/sys/resource/get', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 100, 'parentId': 82, 'sort': 0, 'name': '/sys/resource/update', 'code': '/sys/resource/update', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 101, 'parentId': 82, 'sort': 0, 'name': '/sys/resource/delete', 'code': '/sys/resource/delete', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 102, 'parentId': 82, 'sort': 0, 'name': '/sys/resource/add', 'code': '/sys/resource/add', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 103, 'parentId': 82, 'sort': 0, 'name': '/sys/resource/page', 'code': '/sys/resource/page', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 104, 'parentId': 82, 'sort': 0, 'name': '/sys/resource/list', 'code': '/sys/resource/list', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 105, 'parentId': 82, 'sort': 0, 'name': '/sys/resource/list2', 'code': '/sys/resource/list2', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] }] },
  { 'id': 70, 'parentId': 69, 'sort': 1, 'name': '菜单管理', 'code': '/sys/menuList', 'type': 1, 'usable': '1', 'remarks': '', 'children': [{ 'id': 83, 'parentId': 70, 'sort': 0, 'name': '/sys/menu/get', 'code': '/sys/menu/get', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 84, 'parentId': 70, 'sort': 0, 'name': '/sys/menu/update', 'code': '/sys/menu/update', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 85, 'parentId': 70, 'sort': 0, 'name': '/sys/menu/delete', 'code': '/sys/menu/delete', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 86, 'parentId': 70, 'sort': 0, 'name': '/sys/menu/add', 'code': '/sys/menu/add', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 87, 'parentId': 70, 'sort': 0, 'name': '/sys/menu/page', 'code': '/sys/menu/page', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 88, 'parentId': 70, 'sort': 0, 'name': '/sys/menu/list', 'code': '/sys/menu/list', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 89, 'parentId': 70, 'sort': 0, 'name': '/sys/menu/list2', 'code': '/sys/menu/list2', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] }] },
  { 'id': 71, 'parentId': 69, 'sort': 3, 'name': '角色管理', 'code': '/sys/roleList', 'type': 1, 'usable': '1', 'remarks': '', 'children': [{ 'id': 90, 'parentId': 71, 'sort': 0, 'name': '/sys/role/get', 'code': '/sys/role/get', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 91, 'parentId': 71, 'sort': 0, 'name': '/sys/role/update', 'code': '/sys/role/update', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 92, 'parentId': 71, 'sort': 0, 'name': '/sys/role/delete', 'code': '/sys/role/delete', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 93, 'parentId': 71, 'sort': 0, 'name': '/sys/role/add', 'code': '/sys/role/add', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 94, 'parentId': 71, 'sort': 0, 'name': '/sys/role/page', 'code': '/sys/role/page', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 95, 'parentId': 71, 'sort': 0, 'name': '/sys/role/list', 'code': '/sys/role/list', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 96, 'parentId': 71, 'sort': 0, 'name': '/sys/role/list2', 'code': '/sys/role/list2', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 97, 'parentId': 71, 'sort': 0, 'name': '/sys/role/resources', 'code': '/sys/role/resources', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 98, 'parentId': 71, 'sort': 0, 'name': '/sys/role/setResources', 'code': '/sys/role/setResources', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] }] },
  { 'id': 72, 'parentId': 69, 'sort': 6, 'name': '用户管理', 'code': '/sys/userList', 'type': 1, 'usable': '1', 'remarks': '', 'children': [{ 'id': 106, 'parentId': 72, 'sort': 0, 'name': '/sys/user/get', 'code': '/sys/user/get', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 107, 'parentId': 72, 'sort': 0, 'name': '/sys/user/add', 'code': '/sys/user/add', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 108, 'parentId': 72, 'sort': 0, 'name': '/sys/user/update', 'code': '/sys/user/update', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 109, 'parentId': 72, 'sort': 0, 'name': '/sys/user/delete', 'code': '/sys/user/delete', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 110, 'parentId': 72, 'sort': 0, 'name': '/sys/user/page', 'code': '/sys/user/page', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 111, 'parentId': 72, 'sort': 0, 'name': '/sys/user/roleIds', 'code': '/sys/user/roleIds', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] },
    { 'id': 112, 'parentId': 72, 'sort': 0, 'name': '/sys/user/setRoles', 'code': '/sys/user/setRoles', 'type': 3, 'usable': '1', 'remarks': '', 'children': [] }] }] }]

export default {
  getReourceList: () => {
    return resourceList
  },
  editReource: config => {
    const param = JSON.parse(config.body)
    resourceList = updateList(param, resourceList)
    return resourceList
  },
  deleteReource: config => {
    const { resId } = JSON.parse(config.body)
    resourceList = deleteList(resId, resourceList)
    return resId
  },
  addReource: config => {
    const param = JSON.parse(config.body)
    const minStep = Mock.Random.integer(1000)
    const newId = Mock.mock({ 'id|+1': minStep }).id
    param.id = newId
    resourceList = addList(param, resourceList)
    return param
  },
  batchDelete: config => {
    const { resIds } = JSON.parse(config.body)
    const idArr = resIds.split(',')
    for (let i = 0; i < idArr.length; i++) {
      resourceList = deleteList(idArr[i], resourceList)
    }
    return resIds
  }
}

function deleteList(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    const tar = arr[i]
    if (parseInt(id) === tar.id) {
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
