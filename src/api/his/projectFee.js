import request from '@/utils/request'

// 删除岗位
/*注意！这里少了个/所以导致数据在前台老是拼接起来了正常的是一个1234这种不会是拼接到数据的后面*/
export function delPost(postIds) {
  return request({
    url: '/his/projectFee/' + postIds,
    method: 'delete'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/his/projectFee',
    method: 'post',
    data: data
  })
}

  // 查询岗位列表
  export function listSub() {
    return request({
      url: '/his/projectFee/type',
      method: 'get'
    })
  }

// 查询岗位列表
  export function listPost(query) {
    return request({
      url: '/his/projectFee/list',
      method: 'get',
      params: query
    })
  }

// 导出岗位
  export function exportPost(query) {
    return request({
      url: '/system/post/export',
      method: 'get',
      params: query
    })
  }


// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/his/projectFee/' + postId,
    method: 'get'
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/his/projectFee',
    method: 'put',
    data: data
  })
}



