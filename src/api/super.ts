import {request} from '../utils/request'

export interface AdminDataReq {
  email: string
  password: string
  name: string
}

export interface JsonData {
  msg: string
  data: any
}

export function createAdmin(form: AdminDataReq) {
  return request({
    method: 'post',
    url: '/v4/create_admin',
    data: form
  })
}

export function getExceptionList() {
  return request({
    method: 'get',
    url: '/v4/exception/list'
  })
}

export function deleteExceptionByIdx(idx: number) {
   return request({
     method: 'delete',
     url: `/v4/exception/${idx}`
   })
}
