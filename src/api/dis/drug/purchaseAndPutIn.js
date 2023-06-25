import request from '@/utils/request'


export function listPost(query) {
  return request({
    url: '/dis/order/list',
    method: 'get',
    params: query
  })
}
