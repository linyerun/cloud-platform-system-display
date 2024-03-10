<template>
  <el-table :data="dbList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="编号" width="200" />
    <el-table-column prop="type" label="类型" width="200" />
    <el-table-column prop="name" label="名称" width="200" />
    <el-table-column prop="tag" label="标签" width="120" />
    <el-table-column prop="port" label="端口" width="120" />
    <el-table-column label="大小(单位: MB)" width="200" >
      <template #default="{ row }">{{Math.round(row.size / (1024*1024))}}</template>
    </el-table-column>
    <el-table-column prop="username" label="账号" width="300" />
    <el-table-column prop="password" label="密码" width="200" />
    <el-table-column label="创建者信息" width="200">
      <template #default="{ row }">
        <el-button type="success" size="small" plain @click="getUserMsg(row.creator_id)">查看创建者信息</el-button>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="200">
      <template #default="{ row }">
        <el-button type="danger" size="small" round @click="delDbImage(row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--userMsg弹窗-->
  <el-dialog draggable v-model="userMsgVisible" title="用户信息" width="400">
    <el-form :model="userMsg">
      <el-form-item label="名称" :label-width="100">
        <el-input v-model="userMsg.name" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="100">
        <el-input v-model="userMsg.email" autocomplete="off" disabled/>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {getDbImageList, removeDbImageById, getUserMsgById, DbImage, UserMsg} from '../../../api/admin'
import {ref, onBeforeMount} from 'vue'
import {ErrorInfo, SuccessInfo} from "../../../utils/notice";

const dbList = ref<DbImage[]>([])
const userMsgVisible = ref<boolean>(false)
const userMsg = ref({name: '', email: ''})
const userMsgMap = new Map<string, UserMsg>()

// 删除数据库镜像
async function delDbImage(id: string) {
  // 发送删除请求
  const res = await removeDbImageById(id)
  if (res.code !== 200) {
    ErrorInfo('删除当前镜像失败')
    console.log('err msg: '+res.msg)
    return
  }

  // 更新镜像列表
  dbList.value = dbList.value.filter(cur => cur.id !== id)
  SuccessInfo(`删除编号为${id}镜像成功`)
}

// 获取用户信息
async function getUserMsg(id: string) {
  // 走缓存
  if (userMsgMap.has(id)) {
    const user = userMsgMap.get(id) as UserMsg
    userMsg.value = {...user}
    userMsgVisible.value = true // 显示弹窗
    return
  }

  // 发请求
  const res = await getUserMsgById(id)
  if (res.code !== 200) {
    console.log('err msg: '+res.msg)
    ErrorInfo('获取user数据失败')
    return
  }

  // 赋值给userMsg用于展示
  userMsg.value = res.data as UserMsg

  // 加入缓存中
  userMsgMap.set(id, {...userMsg.value})
  userMsgVisible.value = true // 显示弹窗
}

onBeforeMount(async ()=>{
  const res = await getDbImageList()

  // 处理异常
  if (res.code !== 200) {
    ErrorInfo('获取数据失败, err='+res.msg)
    return
  }

  dbList.value = res.data.db_images
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: DbImage, rowIndex: number }) => {
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
