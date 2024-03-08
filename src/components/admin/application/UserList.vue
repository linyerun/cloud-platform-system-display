<template>
  <el-table :data="userApplicationList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="编号" width="200" />
    <el-table-column prop="email" label="申请者邮箱" width="200" />
    <el-table-column prop="name" label="申请者名称" width="200" />
    <el-table-column prop="explanation" label="申请理由" width="200" />
    <el-table-column label="申请单状态" width="200">
      <template #default="{ row }">
        <el-button v-if="row.status === 0" size="small" type="warning" link>待审</el-button>
        <el-button v-else-if="row.status === 1" size="small" type="success" link>通过</el-button>
        <el-button v-else-if="row.status === 2" size="small" type="danger" link>驳回</el-button>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="200">
      <template #default="{ row }">
        <el-button v-if="row.status === 0" size="small" type="primary" @click="openDialog(row)">执行审核操作</el-button>
        <el-button v-else size="small" type="danger" link>无需操作</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--审核弹窗-->
  <el-dialog draggable v-model="userApplicationFormVisible" title="提交审核" width="200">
    <el-button size="default" type="success" @click="submitApplication(1)">通过</el-button>
    <el-button size="default" type="danger" @click="submitApplication(2)">驳回</el-button>
  </el-dialog>
</template>

<script setup lang="ts">
import {getUserApplicationList, changeUserApplicationStatus, UserApplicationForm, UserApplication} from '../../../api/admin'
import {ref, onBeforeMount} from 'vue'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'

const userApplicationList = ref<UserApplication[]>([])
const userApplicationFormVisible = ref<boolean>(false)
const userApplicationForm = ref<UserApplicationForm>({visitor_id: '', visitor_email: '', status: -1})
let userApplication: UserApplication

function openDialog(userApplicationMsg: UserApplication) {
  userApplication = userApplicationMsg
  console.log(userApplication)
  userApplicationFormVisible.value = true // 打开弹窗
}

async function submitApplication(status: number) {
  console.log(userApplication)
  const res = await changeUserApplicationStatus({visitor_id: userApplication.user_id, visitor_email: userApplication.email, status: status})
  if (res.code !== 200) {
    console.log('err msg: '+res.msg)
    ErrorInfo('游客审核提交异常')
  }else {
    SuccessInfo('审核成功')
    userApplication.status = status
  }

  // 关闭弹窗
  userApplicationFormVisible.value = false
}

onBeforeMount(async ()=>{
  const res = await getUserApplicationList()
  if (res.code !== 200) {
    console.log('err msg: '+res.msg)
    ErrorInfo('读取页面数据失败')
    return
  }

  // 把数据保存起来
  userApplicationList.value = res.data.visitor_applications
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: UserApplication, rowIndex: number }) => {
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
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>
