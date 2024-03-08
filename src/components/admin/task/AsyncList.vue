<template>
  <el-table v-loading="asyncTaskListLoading" :data="asyncTaskList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="编号" width="200" />
    <el-table-column prop="type" label="类型" width="200" />
    <el-table-column label="处理参数" width="800">
      <template  #default="{ row }">
        <JsonViewer :value="argsMap.get(row.id)" copyable boxed sort/>
      </template>
    </el-table-column>
    <el-table-column label="响应数据" width="400">
      <template #default="{ row }">
        <JsonViewer v-if="row.resp_data" :value="respMap.get(row.id)" copyable boxed sort/>
        <div v-else>异步任务尚未被执行</div>
      </template>
    </el-table-column>
    <el-table-column prop="priority" label="优先级" width="120" />
    <el-table-column label="创建时间" width="300">
      <template #default="{ row }">
        {{new Date(row.create_at).getFullYear()}}年{{new Date(row.create_at).getMonth()+1}}月{{new Date(row.create_at).getDate()}}日{{new Date(row.create_at).getHours()}}时{{new Date(row.create_at).getMinutes()}}分{{new Date(row.create_at).getSeconds()}}秒
      </template>
    </el-table-column>
    <el-table-column label="结束时间" width="200">
      <template #default="{ row }">
        <div v-if="row.finish_at !== 0">
          {{new Date(row.finish_at).getFullYear()}}年{{new Date(row.finish_at).getMonth()+1}}月{{new Date(row.finish_at).getDate()}}日{{new Date(row.finish_at).getHours()}}时{{new Date(row.finish_at).getMinutes()}}分{{new Date(row.finish_at).getSeconds()}}秒
        </div>
        <div v-else>尚未被处理</div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="状态" width="120">
      <template #default="{ row }">
        <el-button v-if="row.status === 0" link size="small" type="warning">等待处理</el-button>
        <el-button v-else-if="row.status === 1" link size="small" type="success">处理成功</el-button>
        <el-button v-else link size="small" type="danger">处理失败</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {ref, Ref, onBeforeMount} from 'vue'
import {getAsyncTaskList, AsyncTask} from '../../../api/admin'
import {ErrorInfo} from "../../../utils/notice";
import {JsonViewer} from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css"

const asyncTaskList = ref<AsyncTask[]>([])
const asyncTaskListLoading = ref<boolean>(true)

const argsMap = new Map<string, Ref>;
const respMap = new Map<string, Ref>;


onBeforeMount(async ()=>{
  const res = await getAsyncTaskList()
  if (res.code !== 200) {
    console.log(res.msg)
    ErrorInfo('获取异步任务列表失败')
    return
  }

  asyncTaskList.value = res.data.async_tasks
  // 给json数据解析并包装一层ref
  for (let i = 0; i < asyncTaskList.value.length; i++) {
    const obj = asyncTaskList.value[i]
    argsMap.set(obj.id, ref<any>(JSON.parse(obj.args)))
    respMap.set(obj.id, ref<any>(JSON.parse(obj.resp_data)))
  }
  asyncTaskListLoading.value = false
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: AsyncTask, rowIndex: number }) => {
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
