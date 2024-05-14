<template>
  <el-table :data="errList" style="width: 100%;height: 625px" border>
    <el-table-column label="" width="1300">
      <template  #default="{ row }">
        <JsonViewer :value="row" copyable boxed sort/>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteError(scope.$index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
// @ts-ignore
import {JsonViewer} from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css"
import {getExceptionList, deleteExceptionByIdx, JsonData} from '../../../api/super'
import {ref, onBeforeMount, Ref} from 'vue'
import {ErrorInfo} from '../../../utils/notice'

const errList = ref<Ref<JsonData>[]>([])

function tmp(data: any) {
  console.log(data)
}

onBeforeMount(async ()=>{
  await getErrorList()
})

const getErrorList = async () => {
  const res = await getExceptionList()
  if (res.code !== 200) {
    ErrorInfo('获取数据失败')
    return
  }

  const list: JsonData[] = res.data.exception_list
  for (let i = 0; i < list.length; i++) {
    errList.value.push(ref<JsonData>(list[i]))
  }
}

const deleteError = async (idx: number) => {
  // 删除一个异常
  const res = await deleteExceptionByIdx(idx)
  if (res.code !== 200) {
    ErrorInfo(`删除Idx=${idx}的异常失败`)
    return
  }

  // 把异常从异常列表中剔除
  errList.value.splice(idx,1)
}

</script>

<style scoped>
</style>
