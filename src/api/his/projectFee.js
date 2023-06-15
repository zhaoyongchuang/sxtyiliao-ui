import request from '@/utils/request'

// 查询ProjectFee列表
export function listFee(query) {
  return request({
    url: '/his/projectFee/list',
    method: 'get',
    params: query
  })
}

// 查询ProjectFee详细
export function getFee(projectId) {
  return request({
    url: '/his/projectFee/' + projectId,
    method: 'get'
  })
}

// 新增ProjectFee
export function addFee(data) {
  return request({
    url: '/his/projectFee',
    method: 'post',
    data: data
  })
}

// 修改ProjectFee
export function updateFee(data) {
  return request({
    url: '/his/projectFee',
    method: 'put',
    data: data
  })
}

// 删除ProjectFee
export function delFee(projectId) {
  return request({
    url: '/his/projectFee/' + projectId,
    method: 'delete'
  })
}

// 导出ProjectFee
export function exportFee(query) {
  return request({
    url: '/his/projectFee/export',
    method: 'get',
    params: query
  })
}
