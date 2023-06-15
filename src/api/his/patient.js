import request from '@/utils/request'

// 根据身份证号加载患者
export function getPatientByCode(query) {
  return request({
    url: '/visit/patient/patient/' + query,
    method: 'get'
  })
}

// 新增患者
export function addPatient(patient) {
  return request({
    url : '/visit/patient',
    method: 'post',
    data: patient
  });
}

// 新增挂号
export function addDoctorRegister(doctorRegister) {
  return request({
    url: '/visit/register',
    method: 'post',
    data: doctorRegister
  });
}

// 查询所有挂号费用类型
export function getAllRegistraFee() {
  return request({
    url: '/visit/registerFee/listAll',
    method: 'get'
  });
}

// 条件分页查询患者
export function listDoctorPatient(params) {
  return request({
    url: '/visit/patient/list',
    method: 'get',
    params: params
  });
}
