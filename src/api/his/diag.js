import request from '@/utils/request'

// 根据状态查询挂号
export function getRegisterListByStatus(query) {
  return request({
    url: '/visit/register/listByStatus/' + query,
    method: 'get'
  })
}

// 根据病例主键查询病例
export function getHistoryByHistoryId(historyId) {
  return request({
    url: '/visit/history/' + historyId,
    method: 'get'
  })
}

// 根据病例查询药品处方
export function getMedicalByHistoryId(historyId) {
  return request({
    url: '/visit/medicalPrescription/getByHistory/' + historyId,
    method: 'get'
  })
}

export function addMedicinePrescribe(historyId, totalPrice, medicineDetails) {
  return request({
    url: '/visit/medicalPrescription/' + historyId + "/" + totalPrice,
    method: 'post',
    data: medicineDetails
  });
}

// 查询所有药品
export function getAllDrugs() {
  return request({
    url: '/drugs/drug/all',
    method: 'get'
  })
}

// 保存病例 - 修改
export function updateDoctorPatientHistory(data) {
  return request({
    url: '/visit/history',
    method: 'put',
    data: data
  })
}

// 保存病例 - 新增
export function addDoctorPatientHistory(registerId, data) {
  return request({
    url: '/visit/history/add/'+registerId,
    method: 'post',
    data: data
  })
}

// 根据患者主键，分页查询历史病例
export function getHistoryByPatientId(query) {
  return request({
    url: '/visit/history/listByPatientId',
    method: 'get',
    params: query
  })
}

// 接诊。修改挂号状态为 就诊中
export function treatPatient(registerId) {
  return request({
    url:'/visit/register/treat/' + registerId,
    method: 'put'
  })
}
