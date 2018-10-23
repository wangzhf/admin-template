import request from '@/utils/request'

export const listResource = params => {
  return request({
    url: '/resource/list',
    method: 'post',
    data: params
  })
}

export const deleteResource = params => {
  return request({
    url: '/resource/delete',
    method: 'post',
    data: params
  })
}

export const batchDeleteResource = params => {
  return request({
    url: '/resource/batchDelete',
    method: 'post',
    data: params
  })
}

export const addResource = params => {
  return request({
    url: '/resource/add',
    method: 'post',
    data: params
  })
}

export const updateResource = params => {
  return request({
    url: '/resource/update',
    method: 'post',
    data: params
  })
}

// 角色资源分配
export const assignRole = params => {
  return request({
    url: '/roleresource/add',
    method: 'post',
    data: params
  })
}
