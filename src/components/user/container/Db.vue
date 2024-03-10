<template>
  <el-table :data="dbInstanceList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column label="数据库状态" width="200">
      <template #default="{ row }">
        <el-button v-if="row.status === 1" type="danger" link>休眠中</el-button>
        <el-button v-else-if="row.status === 0" type="success" link>运行中</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="数据库类型" width="200"/>
    <el-table-column prop="db_container_name" label="名称" width="200"/>
    <el-table-column prop="host" label="主机IP地址" width="200"/>
    <el-table-column prop="username" label="初始化账户" width="200"/>
    <el-table-column prop="password" label="初始化密码" width="200"/>
    <el-table-column prop="port" label="连接端口" width="200"/>
    <el-table-column label="创建时间" width="300">
      <template #default="{ row }">
        {{ new Date(row.create_at).getFullYear() }}年{{ new Date(row.create_at).getMonth() + 1 }}月{{ new Date(row.create_at).getDate() }}日{{ new Date(row.create_at).getHours() }}时{{ new Date(row.create_at).getMinutes() }}分{{ new Date(row.create_at).getSeconds() }}秒
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="320">
      <template #default="{ row }">
        <el-button type="danger" size="small" @click="changeMyDbStatus(row.id, 1)" round plain>休眠</el-button>
        <el-button type="success" size="small" @click="changeMyDbStatus(row.id, 0)" round>开启</el-button>
        <el-button type="danger" size="small" @click="changeMyDbStatus(row.id, 2)" round>删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {getDbInstanceList, updateDbStatusById, DbInstance, LinuxInstance} from '../../../api/user'
import {ref, onBeforeMount} from 'vue'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'

const dbInstanceList = ref<DbInstance[]>([])

async function changeMyDbStatus(id: string, status: number) {
  // 发送请求
  const res = await updateDbStatusById(id, status)
  if (res.code !== 200) {
    ErrorInfo(res.msg)
    console.log('err msg: ' + res.msg)
    return
  }

  switch (status) {
    case 3: // 删除
      dbInstanceList.value = dbInstanceList.value.filter(cur => cur.id !== id)
      break
    default:
      for (let i = 0; i < dbInstanceList.value.length; i++) {
        if (dbInstanceList.value[i].id === id) {
          dbInstanceList.value[i].status = status
          return
        }
      }
  }
  SuccessInfo('操作成功!')
}

onBeforeMount(async () => {
  const res = await getDbInstanceList()
  if (res.code !== 200) {
    ErrorInfo('加载数据失败')
    console.log('err msg: ' + res.msg)
    return
  }

  dbInstanceList.value = res.data.db_containers
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: LinuxInstance, rowIndex: number }) => {
  if (row.status === 1) {
    return 'danger-row'
  } else if (row.status === 0) {
    return 'success-row'
  }
  return ''
}
</script>

<style scoped>
</style>
