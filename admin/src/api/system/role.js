import request from '@/utils/request'

export const getRoleList = params => {
  return request({
    url: '/role/roles',
    method: 'post',
    data: params
  })
}

export const editRole = params => {
  return request({
    url: '/role/edit',
    method: 'post',
    data: params
  })
}

export const deleteRole = params => {
  return request({
    url: '/role/delete',
    method: 'post',
    data: params
  })
}

export const addRole = params => {
  return request({
    url: '/role/add',
    method: 'post',
    data: params
  })
}

export const batchDeleteRole = params => {
  return request({
    url: '/role/batchDelete',
    method: 'post',
    data: params
  })
}

export const listRoleMenus = params => {
  return request({
    url: '/role/menu/list',
    method: 'post',
    data: params
  })
}

export const addRoleMenu = params => {
  return request({
    url: '/role/menu/add',
    method: 'post',
    data: params
  })
}
