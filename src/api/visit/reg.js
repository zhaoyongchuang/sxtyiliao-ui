import request from '@/utils/request'

// 查询挂号列表
export function getDoctorRegisterList(query) {
  return request({
    url: '/visit/register/list',
    method: 'get',
    params: query
  })
}

