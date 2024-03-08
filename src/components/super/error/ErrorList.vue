<template>
  <el-table :data="errList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column label="" width="1300">
      <template  #default="{ row }">
        <JsonViewer :value="row" copyable boxed sort/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {JsonViewer} from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css"
import {getExceptionList, JsonData} from '../../../api/super'
import {ref, onBeforeMount, Ref} from 'vue'
import {ErrorInfo} from '../../../utils/notice'

const errList = ref<Ref<JsonData>[]>([])

onBeforeMount(async ()=>{
  const res = await getExceptionList()
  if (res.code !== 200) {
    ErrorInfo('获取数据失败')
    return
  }

  const list: JsonData[] = res.data.exception_list
  for (let i = 0; i < list.length; i++) {
    errList.value.push(ref<JsonData>(list[i]))
  }
})
</script>

<style scoped>
</style>
