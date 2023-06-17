import request from '@/utils/request'

// 查询durgdurg列表
export function listDurgdurg(query) {
  return request({
    url: '/his/durgdurg/list',
    method: 'get',
    params: query
  })
}

// 查询durgdurg详细
export function getDurgdurg(durgId) {
  return request({
    url: '/his/durgdurg/' + durgId,
    method: 'get'
  })
}

// 新增durgdurg
export function addDurgdurg(data) {
  return request({
    url: '/his/durgdurg',
    method: 'post',
    data: data
  })
}

// 修改durgdurg
export function updateDurgdurg(data) {
  return request({
    url: '/his/durgdurg',
    method: 'put',
    data: data
  })
}

// 删除durgdurg
export function delDurgdurg(durgId) {
  return request({
    url: '/his/durgdurg/' + durgId,
    method: 'delete'
  })
}

// 导出durgdurg
export function exportDurgdurg(query) {
  return request({
    url: '/his/durgdurg/export',
    method: 'get',
    params: query
  })
}
