import request from '@/utils/request'

// 查询DrugsProducer列表
export function listDrugsProducer(query) {
  return request({
    url: '/dis/DrugsProducer/list',
    method: 'get',
    params: query
  })
}

// 查询DrugsProducer详细
export function getDrugsProducer(proId) {
  return request({
    url: '/dis/DrugsProducer/' + proId,
    method: 'get'
  })
}

// 新增DrugsProducer
export function addDrugsProducer(data) {
  return request({
    url: '/dis/DrugsProducer',
    method: 'post',
    data: data
  })
}

// 修改DrugsProducer
export function updateDrugsProducer(data) {
  return request({
    url: '/dis/DrugsProducer',
    method: 'put',
    data: data
  })
}

// 删除DrugsProducer
export function delDrugsProducer(proId) {
  return request({
    url: '/dis/DrugsProducer/' + proId,
    method: 'delete'
  })
}

// 导出DrugsProducer
export function exportDrugsProducer(query) {
  return request({
    url: '/dis/DrugsProducer/export',
    method: 'get',
    params: query
  })
}
