<template>
  <el-table :data="imageList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="编号" width="200" />
    <el-table-column prop="creator.name" label="构建者" width="200" />
    <el-table-column prop="creator.email" label="构建者邮箱" width="200" />
    <el-table-column prop="name" label="名称" width="500" />
    <el-table-column prop="tag" label="标签" width="120" />
    <el-table-column label="大小(单位: MB)" width="200" >
      <template #default="{ row }">{{Math.round(row.size / (1024*1024))}}</template>
    </el-table-column>
    <el-table-column prop="enable_commands" label="启动指令" width="300" />
    <el-table-column prop="must_export_ports" label="必暴露端口" width="200" />
    <el-table-column fixed="right" label="操作" width="200">
      <template #default="{ row }">
        <el-button type="danger" size="small" round @click="delImage(row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {getImageList, deleteImageById, Image} from '../../../api/admin'
import {onBeforeMount, ref} from 'vue'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'

const imageList = ref<Image[]>([])

async function delImage(id: string) {
  // 发送删除请求
  const res = await deleteImageById(id)
  if (res.code !== 200) {
    ErrorInfo('删除当前镜像失败')
    console.log('err msg: '+res.msg)
    return
  }

  // 更新镜像列表
  imageList.value = imageList.value.filter(cur => cur.id !== id)
  SuccessInfo(`删除编号为${id}镜像成功`)
}

// 获取数据并渲染
onBeforeMount(async ()=>{
  const res = await getImageList()

  // 处理异常
  if (res.code !== 200) {
    ErrorInfo('获取数据失败, err='+res.msg)
    return
  }

  imageList.value = res.data.images
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: Image, rowIndex: number }) => {
  if (rowIndex%4 === 0) {
    return 'danger-row'
  } else if (rowIndex%4 === 2) {
    return 'success-row'
  }
  return ''
}

</script>

<style>
.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
