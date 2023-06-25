import request from "@/utils/request";

export function getAllDrugSupports(query) {
  return request({
    url: '/pill/support/all',
    method: 'get'
  })
}
