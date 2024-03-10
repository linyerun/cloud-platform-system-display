<template>
  <div class="db_pull_form">
    <el-form label-position="left" label-width="auto" :model="dbTaskForm" style="max-width: 600px">
      <el-form-item label="数据库镜像名称" :rules="[{ required: true}]">
        <el-input v-model="dbTaskForm.image_name" />
      </el-form-item>
      <el-form-item label="数据库镜像标签" :rules="[{ required: true}]">
        <el-input v-model="dbTaskForm.image_tag" />
      </el-form-item>
      <el-form-item label="数据库镜像类型" :rules="[{ required: true}]">
        <el-select v-model="dbTaskForm.type">
          <el-option label="MySQL" value="mysql" />
          <el-option label="Redis" value="redis" />
          <el-option label="MongoDB" value="mongo" />
        </el-select>
      </el-form-item>
      <el-form-item label="镜像访问端口" :rules="[{ required: true},{ type: 'number'}]">
        <el-input v-model.number="dbTaskForm.port" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitDbImagePullTask">提交表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {createDbImageTask, DbImagePullTask} from '../../../api/admin'
import {ref} from 'vue'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'

const dbTaskForm = ref<DbImagePullTask>({image_name: '', image_tag: '', port: 0, type: 'mysql'})

async function submitDbImagePullTask() {
  const res = await createDbImageTask(dbTaskForm.value)
  if (res.code !== 200) {
    console.log('err msg: ', res.msg)
    ErrorInfo(res.msg)
    return
  }

  SuccessInfo('新增异步拉取镜像任务成功')
  dbTaskForm.value = {image_name: '', image_tag: '', port: 0, type: 'mysql'}
}

</script>

<style scoped>
.db_pull_form {
  position: absolute;
  /*定位方式绝对定位absolute*/
  top: 50%;
  left: 50%;
  /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
  transform: translate(-50%, -50%);
  /*背景颜色*/
  background: rgb(255, 255, 255);
}
</style>
