<template>
  <el-table :data="adminList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="编号" width="200" />
    <el-table-column prop="name" label="管理员名称" width="200" />
    <el-table-column prop="email" label="管理员邮箱" width="200" />
    <el-table-column fixed="right" label="操作" width="200">
      <template #default="{ row }">
        <el-button round type="primary" size="small" @click="showExplanationInput(row)">向该管理员提交申请</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--申请理由填写弹出框-->
  <el-dialog draggable v-model="explanationInputVisible" title="游客申请转用户" width="500">
    <el-form :model="applicationForm">
      <el-form-item label="申请理由" :label-width="100">
        <el-input v-model="applicationForm.explanation" placeholder="请填写申请理由" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="applyToUser">提交申请</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {getAdminList, visitorToUserApplication, VisitorApplicationForm, AdminMsg} from '../../../api/visitor'
import {ref, onBeforeMount} from 'vue'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'
import {Image} from "../../../api/user";

const adminList = ref<AdminMsg[]>([])
const explanation = ref<string>('')
const applicationForm = ref<VisitorApplicationForm>({admin_email: '', admin_id: '', explanation: ''})
const explanationInputVisible = ref<boolean>(false)

// 申请成功用户
async function applyToUser() {

  // 发送请求
  const res = await visitorToUserApplication(applicationForm.value)

  // 处理请求
  if (res.code !== 200) {
    ErrorInfo('提交申请失败, err='+res.msg)
  }else {
    SuccessInfo('提交申请成功')
  }

  // 关闭弹窗
  explanationInputVisible.value = false
}

// 显示弹出框
function showExplanationInput(admin: AdminMsg) {
  // 初始化
  applicationForm.value.admin_id = admin.id
  applicationForm.value.admin_email = admin.email
  applicationForm.value.explanation = ''
  // 显示弹窗
  explanationInputVisible.value = true
}

// 渲染数据
onBeforeMount(async ()=>{
  // 获取管理员数据
  const res = await getAdminList()

  // 处理异常
  if (res.code !== 200) {
    ErrorInfo('获取数据失败, err='+res.msg)
    return
  }

  // 渲染数据
  adminList.value = res.data.admins
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: Image, rowIndex: number }) => {
  if (rowIndex%4 === 0) {
    return 'warning-row'
  } else if (rowIndex%4 === 2) {
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
</style>
