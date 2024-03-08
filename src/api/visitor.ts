import {request} from '../utils/request'

export interface VisitorApplicationForm {
  admin_id: string
  admin_email: string
  explanation: string
}

export interface AdminMsg {
  id: string
  email: string
  name: string
}

export function getAdminList() {
  return request({method: 'get', url: '/v1/admin/all'})
}

export function visitorToUserApplication(form: VisitorApplicationForm) {
  return request({method: 'post', url: '/v1/to/user', data: form})
}
