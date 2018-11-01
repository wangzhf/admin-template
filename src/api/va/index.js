import request from '@/utils/request'

const list = params => {
  return request({
    url: '/user/userList',
    method: 'post',
    data: params
  })
}

const update = params => {
  return request({
    url: '/user/edit',
    method: 'post',
    data: params
  })
}

const del = params => {
  return request({
    url: '/user/delete',
    method: 'post',
    data: params
  })
}

const add = params => {
  return request({
    url: '/user/add',
    method: 'post',
    data: params
  })
}

const batchDelete = params => {
  return request({
    url: '/user/batchDelete',
    method: 'post',
    data: params
  })
}

export default {
  list,
  update,
  add,
  del,
  batchDelete
}
