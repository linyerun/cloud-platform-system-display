<template>
  <el-table :data="dbApplicationList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="编号" width="200" />
    <el-table-column prop="status" label="申请状态" width="200">
      <template #default="{ row }">
        <el-button v-if="row.status === 0" link type="primary" size="small" @click="">等待审核</el-button>
        <el-button v-else-if="row.status === 1" link type="success" size="small" @click="">审核成功</el-button>
        <el-button v-else-if="row.status === 2" link type="danger" size="small" @click="">驳回审核</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="explanation" label="申请理由" width="200" />
    <el-table-column prop="db_name" label="数据库名称" width="200" />
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
    <el-table-column label="完成时间" width="300">
      <template #default="{ row }">
        <div v-if="row.finish_at !== 0">
          {{new Date(row.finish_at).getFullYear()}}年{{new Date(row.finish_at).getMonth()+1}}月{{new Date(row.finish_at).getDate()}}日{{new Date(row.finish_at).getHours()}}时{{new Date(row.finish_at).getMinutes()}}分{{new Date(row.finish_at).getSeconds()}}秒
        </div>
        <div v-else>尚未完成</div>
      </template>
    </el-table-column>
    <el-table-column prop="reject_reason" label="管理员拒绝理由" width="200" />
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
  <el-dialog draggable v-model="imageMsgVisible" title="DB镜像信息" width="600">
    <el-form :model="imageMsg">
      <el-form-item label="创建者名称" :label-width="200">
        <el-input v-model="imageMsg.user_msg.name" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="创建者邮箱" :label-width="200">
        <el-input v-model="imageMsg.user_msg.email" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="镜像名称" :label-width="200">
        <el-input v-model="imageMsg.db_image.name" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="镜像标签" :label-width="200">
        <el-input v-model="imageMsg.db_image.tag" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="镜像类型" :label-width="200">
        <el-input v-model="imageMsg.db_image.type" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="镜像大小(单位: 字节)" :label-width="200">
        <el-input v-model="imageMsg.db_image.size" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="账号" :label-width="200">
        <el-input v-model="imageMsg.db_image.username" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="密码" :label-width="200">
        <el-input v-model="imageMsg.db_image.password" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="内部开发端口" :label-width="200">
        <el-input v-model="imageMsg.db_image.port" autocomplete="off" disabled/>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--审核弹窗-->
  <el-dialog draggable v-model="examinationFormVisible" title="提交审核" width="600">
    <el-form :model="examinationForm">
      <el-form-item label="拒绝理由" :label-width="100">
        <el-input v-model="examinationForm.reject_reason" autocomplete="off" placeholder="如需拒绝可填写拒绝理由"/>
      </el-form-item>
      <el-footer>
        <el-button size="default" type="success" @click="submitExamination(1)">通过</el-button>
        <el-button size="default" type="danger" @click="submitExamination(2)">驳回</el-button>
      </el-footer>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, onBeforeMount} from "vue";
import {
  getDbApplicationList,
  getUserMsgById,
  getDbImageById,
  DbApplication,
  UserMsg,
  DbImageMsg,
  changeDbApplicationStatus
} from "../../../api/admin";
import {ErrorInfo, SuccessInfo} from "../../../utils/notice";

const dbApplicationList = ref<DbApplication[]>([])

const userMsgMap = new Map<string, UserMsg>()
const imageMsgMap = new Map<string, DbImageMsg>()

const userMsg = ref<UserMsg>({name: '', email: ''})
const userMsgVisible = ref<boolean>(false)

const imageMsg = ref<DbImageMsg>({db_image: {id: '', image_id: '', size: 0, tag: '', created_at: 0, name: '', creator_id: '', port: 0, password: '', username: '', type: ''}, user_msg:{name: '', email: ''}})
const imageMsgVisible = ref<boolean>(false)

const examinationFormVisible = ref(false)
const examinationForm = ref({reject_reason: '', id: ''})

let applicationRow: DbApplication

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
    const image = imageMsgMap.get(id) as DbImageMsg
    imageMsg.value = {...image}
    imageMsgVisible.value = true //显示弹窗
    return
  }

  // 发请求
  const res = await getDbImageById(id)
  if (res.code !== 200) {
    console.log('err msg: '+res.msg)
    ErrorInfo(res.msg)
    return
  }

  // 赋值给imageMsg用于展示
  imageMsg.value = {...res.data.db_image as DbImageMsg}

  // 加入缓存中
  imageMsgMap.set(id, {...imageMsg.value})
  imageMsgVisible.value = true //显示弹窗
}

// 打开审核窗口
function openExamination(row: DbApplication) {
  applicationRow = row
  examinationFormVisible.value = true
  examinationForm.value.id = row.id
}

// 提交审核
async function submitExamination(status: number) {
  const form = examinationForm.value
  const res = await changeDbApplicationStatus(form.id, form.reject_reason, status)
  if (res.code !== 200) {
    ErrorInfo(res.msg)
    console.log('err msg: '+res.msg)
    return
  }else {
    SuccessInfo('审核成功')
    applicationRow.status = status
  }


  examinationFormVisible.value = false
  examinationForm.value = {id: '', reject_reason: ''}
}


onBeforeMount(async ()=>{
  const res = await getDbApplicationList()
  if (res.code !== 200) {
    ErrorInfo(res.msg)
    console.log('err msg: '+res.msg)
    return
  }

  dbApplicationList.value = res.data.db_application_forms
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: DbApplication, rowIndex: number }) => {
  if (row.status === 0) {
    return 'warning-row'
  } else if (row.status === 1) {
    return 'success-row'
  }else if (row.status === 2) {
    return 'danger-row'
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
