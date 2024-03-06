import {request} from '../utils/request'

export interface User {
  id: string
  email: string
  name: string
}

export interface Image {
  id: string
  creator: User
  name: string
  tag: string
  image_id: string
  size: number
  enable_commands: string[]
  must_export_ports: number[]
}

export function getImageList() {
  return request({method: 'get', url: '/v2/user/linux/list'})
}
