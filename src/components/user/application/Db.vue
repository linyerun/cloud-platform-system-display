<template>
  <el-table :data="dbApplicationList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="名称" width="200"/>
    <el-table-column label="创建时间" width="300">
      <template #default="{ row }">
        {{ new Date(row.create_at).getFullYear() }}年{{ new Date(row.create_at).getMonth() + 1 }}月{{ new Date(row.create_at).getDate() }}日{{ new Date(row.create_at).getHours() }}时{{ new Date(row.create_at).getMinutes() }}分{{ new Date(row.create_at).getSeconds() }}秒
      </template>
    </el-table-column>
    <el-table-column label="完成时间" width="300">
      <template #default="{ row }">
        <div v-if="row.status === 0">尚未被处理</div>
        <div v-else>
          {{ new Date(row.finish_at).getFullYear() }}年{{ new Date(row.finish_at).getMonth() + 1 }}月{{ new Date(row.finish_at).getDate() }}日{{ new Date(row.finish_at).getHours() }}时{{ new Date(row.finish_at).getMinutes() }}分{{ new Date(row.finish_at).getSeconds() }}秒
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="explanation" label="申请理由" width="400"/>
    <el-table-column prop="reject_reason" label="管理员拒绝的理由" width="400">
      <template #default="{ row }">
        <div v-if="row.status === 0">尚未被处理</div>
        <div v-else>
          {{row.reject_reason}}
        </div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="申请状态" width="200">
      <template #default="{ row }">
        <el-button v-if="row.status === 0" type="primary" plain>等待处理</el-button>
        <el-button v-else-if="row.status === 1" type="success" plain>审核通过</el-button>
        <el-button v-else type="danger" plain>审核拒绝</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {ref, onBeforeMount} from 'vue'
import {getDbApplication, DbApplication} from '../../../api/user'
import {ErrorInfo} from '../../../utils/notice'

const dbApplicationList = ref<DbApplication[]>([])

onBeforeMount(async () => {
  const res = await getDbApplication()
  if (res.code !== 200) {
    ErrorInfo('获取数据失败')
    console.log('err msg: ' + res.msg)
    return
  }

  dbApplicationList.value = res.data.db_application_forms
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: DbApplication, rowIndex: number }) => {
  if (row.status === 2) {
    return 'danger-row'
  } else if (row.status === 1) {
    return 'success-row'
  }
  return 'warning-row'
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
