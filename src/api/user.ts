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

export interface LinuxApplicationForm {
  container_name: string
  image_id: string
  export_ports: number[]
  explanation: string
  memory: number
  memory_swap: number
  core_count: number
  disk_size: number
}

export interface LinuxApplicationObject {
  id: string
  user_id: string
  explanation: string
  image_id: string
  container_name: string

  export_ports: number[]

  memory: number
  memory_swap: number

  core_count: number

  disk_size: number

  status: number
  create_at: string
  finish_at: string
}

export interface KV {
  key: number
  value: number
}

export interface LinuxInstance {
  id: string
  user_id: string
  name: string
  user_container_name: string
  imageId: string
  create_at: number
  start_time: number
  stop_time: number
  status: number
  host: string
  ports_mapping: Map<number, number>
  my_ports_mapping: Map<number, number>
  my_ports_array: KV[]
  init_username: string
  init_password: string
  memory: number
  memory_swap: number
  core_count: number
  disk_size: number
}

export function getImageList() {
  return request({method: 'get', url: '/v2/user/linux/list'})
}

export function applyForLinux(form: LinuxApplicationForm) {
  return request({method: 'post', url: '/v2/user/apply/linux', data: form})
}

export function getLinuxApplicationList() {
  return request({method: 'get', url: '/v2/linux_application_form/list'})
}

export function getLinuxInstanceList() {
  return request({method: 'get', url: '/v2/linux_container/list'})
}

export function changeLinuxStatus(container_id: string, status: number) {
  return request({method: 'put', url: `/v2/linux_container/change/${container_id}/${status}`})
}

export function deleteLinux(container_id: string) {
  return request({method: 'delete', url: `/v2/linux_container/${container_id}`})
}
