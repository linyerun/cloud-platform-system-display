<template>
  <el-table :data="applicationList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
      <el-table-column prop="container_name" label="名称" width="200" />
      <el-table-column prop="export_ports" label="暴露的端口" width="200" />
      <el-table-column prop="memory" label="内存大小" width="200" />
      <el-table-column prop="core_count" label="核心数量" width="200" />
      <el-table-column label="创建时间" width="300">
        <template #default="{ row }">
          {{new Date(row.create_at).getFullYear()}}年{{new Date(row.create_at).getMonth()+1}}月{{new Date(row.create_at).getDate()}}日{{new Date(row.create_at).getHours()}}时{{new Date(row.create_at).getMinutes()}}分{{new Date(row.create_at).getSeconds()}}秒
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
import {reactive, onBeforeMount} from 'vue'
import {getLinuxApplicationList, LinuxApplicationObject} from '../../../api/user'

const applicationList = reactive<LinuxApplicationObject[]>([])

onBeforeMount(async ()=>{
  // 获取申请列表
  const res = await getLinuxApplicationList()

  // 插入列表
  applicationList.push.apply(applicationList, res.data.linux_application_forms)
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: LinuxApplicationObject, rowIndex: number }) => {
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
