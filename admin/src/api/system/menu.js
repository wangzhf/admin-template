import request from '@/utils/request'

export const listMenu = params => {
  return request({
    url: '/menu/list',
    method: 'post',
    data: params
  })
}

export const deleteMenu = params => {
  return request({
    url: '/menu/delete',
    method: 'post',
    data: params
  })
}

export const batchDeleteMenu = params => {
  return request({
    url: '/menu/batchDelete',
    method: 'post',
    data: params
  })
}

export const addMenu = params => {
  return request({
    url: '/menu/add',
    method: 'post',
    data: params
  })
}

export const updateMenu = params => {
  return request({
    url: '/menu/update',
    method: 'post',
    data: params
  })
}

// 角色资源分配
export const assignRole = params => {
  return request({
    url: '/rolemenu/add',
    method: 'post',
    data: params
  })
}
