import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/his/dept/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(deptId) {
  return request({
    url: '/his/dept/' + deptId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/his/dept',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/his/dept',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(deptId) {
  return request({
    url: '/his/dept/' + deptId,
    method: 'delete'
  })
}

// 导出岗位
export function exportPost(query) {
  return request({
    url: '/his/dept/export',
    method: 'get',
    params: query
  })
}
