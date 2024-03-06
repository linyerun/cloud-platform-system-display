<template>
  <el-table :data="imageList" style="width: 100%" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="编号" width="200" />
    <el-table-column label="创建者" width="120">
      <template #default="{ row }">
        <el-button round type="danger" size="small" @click="showUserMsg(row.creator)">{{row.creator.name}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称" width="500" />
    <el-table-column prop="tag" label="标签" width="120" />
    <el-table-column prop="size" label="大小(单位: 字节)" width="200" />
    <el-table-column prop="enable_commands" label="启动指令" width="300" />
    <el-table-column prop="must_export_ports" label="必暴露端口" width="200" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="createLinuxContainer">创建服务器</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {getImageList, Image, User} from '../../../api/user'
import {onBeforeMount, reactive} from 'vue'

// 获取镜像列表
const imageList = reactive<Image[]>([])

// 创建Linux服务器
function createLinuxContainer() {

}

// 获取数据并渲染
onBeforeMount(async ()=>{
  const res = await getImageList()
  imageList.push.apply(imageList, res.data.images)
})

// 展示用户信息
function showUserMsg(user: User) {

}

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
