import {request} from '../utils/request'

export interface LinuxApplication {
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
  create_at: number
  finish_at: number
}

export interface UserMsg {
  name: string
  email: string
}

export interface ImageMsg {
  creator_name: string
  creator_email: string
  image_name: string
  image_tag: string
  image_size: number
  enable_commands: string[]
  must_export_ports: number[]
}

export interface LinuxApplicationForm {
  form_id: string
  status: number
}

export interface AsyncTask {
  id: string
  user_id: string
  type: string
  args: string
  resp_data: string
  priority: number
  status: number
  create_at: number
  finish_at: number
}

export interface UserApplicationForm {
  visitor_id: string
  status: number
  visitor_email: string
}

export interface UserApplication {
  id: string
  user_id: string
  email: string
  name: string
  explanation: string
  status: number
}

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

export interface ImagePullReq {
  image_name: string
  image_tag: string
  image_enabled_commands: string[]
  image_must_export_ports: number[]
}

export function getLinuxApplicationList() {
  return request({method: 'get', url: '/v3/users_linux_application_form/list'})
}

export function getUserMsgById(id: string) {
  return request({
    method: 'get',
    url: `/v3/user/${id}`
  })
}

export function getImageMsgById(id: string) {
  return request({
    method: 'get',
    url: `/v3/image/${id}`
  })
}

export function changeLinuxApplicationStatus(form_id: string, status: number) {
  return request({
    method: 'put',
    url: `/v3/user_linux_apply/handle/${form_id}/${status}`
  })
}

export function getAsyncTaskList() {
  return request({
    method: 'get',
    url: '/v3/asynctask/list'
  })
}

export function getUserApplicationList() {
  return request({
    method: 'get',
    url: '/v3/application_forms/list'
  })
}

export function changeUserApplicationStatus(form: UserApplicationForm) {
  return request({
    method: 'put',
    url: `/v3/visitor_to_user/${form.visitor_id}/${form.status}`,
    data: {
      'visitor_email': form.visitor_email
    }
  })
}

export function getImageList() {
  return request({method: 'get', url: '/v3/admin/linux/list'})
}

export function deleteImageById(id: string) {
  return request({
    method: 'delete',
    url: `/v3/linux/del/${id}`
  })
}

export function postPullImageTask(task: ImagePullReq) {
  return request({
    method: 'post',
    url: '/v3/linux/pull',
    data: task
  })
}

export interface DbImage {
  id: string
  creator_id: string
  type: string
  name: string
  tag: string
  username: string
  password: string
  image_id: string
  size: number
  port: number
  created_at: number
}

export function getDbImageList() {
  return request({
    method: 'get',
    url: '/v3/db-image/list'
  })
}

export interface DbImagePullTask {
  image_name: string
  image_tag: string
  type: string
  port: number
}

export function createDbImageTask(task: DbImagePullTask) {
  return request({
    method: 'post',
    url: '/v3/db-image/pull',
    data: task
  })
}

export function removeDbImageById(id: string) {
  return request({
    method: 'delete',
    url: `/v3/db-image/${id}`
  })
}

export interface DbApplication {
  id: string
  user_id: string
  explanation: string
  reject_reason: string
  image_id: string
  db_name: string
  status: number
  create_at: number
  finish_at: number
}

export function getDbApplicationList() {
  return request({
    method: 'get',
    url: '/v3/db-application/list'
  })
}

export interface Db_image {
  id: string;
  creator_id: string;
  type: string;
  name: string;
  tag: string;
  username: string;
  password: string;
  image_id: string;
  size: number;
  port: number;
  created_at: number;
}

export interface User_msg {
  email: string;
  name: string;
}

export interface DbImageMsg {
  db_image: Db_image;
  user_msg: User_msg;
}

export function getDbImageById(id: string) {
  return request({
    method: 'get',
    url: `/v3/db-image/${id}`
  })
}

export function changeDbApplicationStatus(id: string, reject_reason: string, status: number) {
  return request({
    method: 'put',
    url: `/v3/db-application/${id}/${status}`,
    data: {
      'reject_reason': reject_reason,
    }
  })
}
