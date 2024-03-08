<template>
  <el-table :data="linuxApplicationList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="编号" width="200" />
    <el-table-column prop="status" label="申请状态" width="200">
      <template #default="{ row }">
        <el-button v-if="row.status === 0" link type="primary" size="small" @click="">等待审核</el-button>
        <el-button v-else-if="row.status === 1" link type="success" size="small" @click="">审核成功</el-button>
        <el-button v-else-if="row.status === 2" link type="danger" size="small" @click="">驳回审核</el-button>
        <el-button v-else link type="warning" size="small" @click="">正在处理</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="explanation" label="申请理由" width="200" />
    <el-table-column prop="export_ports" label="需开放的端口" width="200" />
    <el-table-column prop="memory" label="内存大小(单位: KB)" width="200" />
    <el-table-column prop="core_count" label="CPU核心数" width="200" />
    <el-table-column label="申请者信息" width="200" >
      <template #default="{ row }">
        <el-button link size="small" type="success" @click="getUserMsg(row.user_id)">查看</el-button>
      </template>
    </el-table-column>
    <el-table-column label="服务器镜像信息" width="200" >
      <template #default="{ row }">
        <el-button link size="small" type="primary" @click="getImageMsg(row.image_id)">查看</el-button>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" width="300">
      <template #default="{ row }">
        {{new Date(row.create_at).getFullYear()}}年{{new Date(row.create_at).getMonth()+1}}月{{new Date(row.create_at).getDate()}}日{{new Date(row.create_at).getHours()}}时{{new Date(row.create_at).getMinutes()}}分{{new Date(row.create_at).getSeconds()}}秒
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="200">
      <template #default="{ row }">
        <el-button v-if="row.status === 0" round type="danger" size="small" @click="openExamination(row)">审核</el-button>
        <el-button v-else size="small" link type="primary">无需审核</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--userMsg弹窗-->
  <el-dialog draggable v-model="userMsgVisible" title="用户信息" width="400">
    <el-form :model="userMsg">
      <el-form-item label="名称" :label-width="100">
        <el-input v-model="userMsg.name" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="100">
        <el-input v-model="userMsg.email" autocomplete="off" disabled/>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--imageMsg弹窗-->
  <el-dialog draggable v-model="imageMsgVisible" title="用户信息" width="600">
    <el-form :model="imageMsg">
      <el-form-item label="创建者名称" :label-width="200">
        <el-input v-model="imageMsg.creator_name" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="创建者邮箱" :label-width="200">
        <el-input v-model="imageMsg.creator_email" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="镜像名称" :label-width="200">
        <el-input v-model="imageMsg.image_name" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="镜像标签" :label-width="200">
        <el-input v-model="imageMsg.image_tag" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="镜像大小(单位: 字节)" :label-width="200">
        <el-input v-model="imageMsg.image_size" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="开启指令" :label-width="200">
        <el-input v-model="imageMsg.enable_commands" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="必暴接口" :label-width="200">
        <el-input v-model="imageMsg.must_export_ports" autocomplete="off" disabled/>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--审核弹窗-->
  <el-dialog draggable v-model="examinationFormVisible" title="提交审核" width="200">
    <el-button size="default" type="success" @click="submitExamination(1)">通过</el-button>
    <el-button size="default" type="danger" @click="submitExamination(2)">驳回</el-button>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getLinuxApplicationList,
  getUserMsgById,
  getImageMsgById,
  changeLinuxApplicationStatus,
  LinuxApplication,
  UserMsg,
  ImageMsg,
  LinuxApplicationForm
} from '../../../api/admin'
import {ref, onBeforeMount} from 'vue'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'
import {LinuxApplicationObject} from '../../../api/user'

const linuxApplicationList = ref<LinuxApplication[]>([])
const userMsg = ref<UserMsg>({name: '', email: ''})
const userMsgVisible = ref<boolean>(false)
const imageMsg = ref<ImageMsg>({creator_name: '', image_name: '', image_size: 0, image_tag: '', creator_email: '', enable_commands: [], must_export_ports: []})
const imageMsgVisible = ref<boolean>(false)
let examinationForm: LinuxApplication
const examinationFormVisible = ref<boolean>(false)
const userMsgMap = new Map<string, UserMsg>()
const imageMsgMap = new Map<string, ImageMsg>()

// 获取用户信息
async function getUserMsg(id: string) {
  // 走缓存
  if (userMsgMap.has(id)) {
    const user = userMsgMap.get(id) as UserMsg
    userMsg.value = {...user}
    userMsgVisible.value = true // 显示弹窗
    return
  }

  // 发请求
  const res = await getUserMsgById(id)
  if (res.code !== 200) {
    console.log('err msg: '+res.msg)
    ErrorInfo('获取user数据失败')
    return
  }

  // 赋值给userMsg用于展示
  userMsg.value = res.data as UserMsg

  // 加入缓存中
  userMsgMap.set(id, {...userMsg.value})
  userMsgVisible.value = true // 显示弹窗
}

// 获取镜像信息
async function getImageMsg(id: string) {
  // 走缓存
  if (imageMsgMap.has(id)) {
    const image = imageMsgMap.get(id) as ImageMsg
    imageMsg.value = {...image}
    imageMsgVisible.value = true //显示弹窗
    return
  }

  // 发请求
  const res = await getImageMsgById(id)
  if (res.code !== 200) {
    console.log('err msg: '+res.msg)
    ErrorInfo(res.msg)
    return
  }

  // 赋值给imageMsg用于展示
  imageMsg.value = {...res.data as ImageMsg}

  // 加入缓存中
  imageMsgMap.set(id, {...imageMsg.value})
  imageMsgVisible.value = true //显示弹窗
}

// 打开审核弹窗
async function openExamination(form: LinuxApplication) {
  // 初始化待提交参数
  examinationForm = form
  examinationFormVisible.value = true // 打开弹窗
}

// 提交审核
async function submitExamination(status: number) {
  const res = await changeLinuxApplicationStatus(examinationForm.id, status)
  if (res.code !== 200) {
    console.log('err msg: '+res.msg)
    ErrorInfo('审核提交异常')
    return
  }

  // 改变row的status
  examinationForm.status = 3

  examinationFormVisible.value = false // 关闭弹窗
  SuccessInfo(res.msg)
}

// 加载页面前渲染数据
onBeforeMount(async ()=> {
  const res = await getLinuxApplicationList()
  if (res.code !== 200) {
    ErrorInfo('加载页面数据失败')
    console.log('err msg: '+res.msg)
    return
  }
  linuxApplicationList.value = res.data.linux_application_forms
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: LinuxApplicationObject, rowIndex: number }) => {
  if (row.status === 0) {
    return 'warning-row'
  } else if (row.status === 1) {
    return 'success-row'
  }else if (row.status === 2) {
    return 'danger-row'
  }else if (row.status === 3) {
    return 'success-row'
  }
  return ''
}
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>
