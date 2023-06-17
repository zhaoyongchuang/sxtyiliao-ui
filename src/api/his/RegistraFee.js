import request from '@/utils/request'

// 查询RegistraFee列表
export function listRegistraFee(query) {
  return request({
    url: '/his/RegistraFee/list',
    method: 'get',
    params: query
  })
}

// 查询RegistraFee详细
export function getRegistraFee(registraId) {
  return request({
    url: '/his/RegistraFee/' + registraId,
    method: 'get'
  })
}

// 新增RegistraFee
export function addRegistraFee(data) {
  return request({
    url: '/his/RegistraFee',
    method: 'post',
    data: data
  })
}

// 修改RegistraFee
export function updateRegistraFee(data) {
  return request({
    url: '/his/RegistraFee',
    method: 'put',
    data: data
  })
}

// 删除RegistraFee
export function delRegistraFee(registraId) {
  return request({
    url: '/his/RegistraFee/' + registraId,
    method: 'delete'
  })
}

// 导出RegistraFee
export function exportRegistraFee(query) {
  return request({
    url: '/his/RegistraFee/export',
    method: 'get',
    params: query
  })
}
