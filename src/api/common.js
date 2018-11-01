import request from '@/utils/request'

const Get = (url, data) => {
  return request({
    url: url,
    method: 'get',
    data
  })
}

const Post = (url, data) => {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export default {
  Get,
  Post
}
