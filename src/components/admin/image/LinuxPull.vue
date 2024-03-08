<template>
  <div class="linux_pull_form">
    <el-form ref="formRef" style="max-width: 600px" :model="imageTaskForm" label-width="auto" class="demo-dynamic">
      <el-form-item prop="image_name" label="镜像名称">
        <el-input v-model="imageTaskForm.image_name" />
      </el-form-item>
      <el-form-item prop="image_tag" label="镜像标签">
        <el-input v-model="imageTaskForm.image_tag" />
      </el-form-item>
      <el-form-item
          v-for="(command, index) in imageTaskForm.image_enabled_commands"
          :key="command.key"
          :label="'开机指令' + index"
          :prop="'command.' + index + '.value'">
        <div style="display: flex; flex-direction: row; justify-content:space-between; width: 100%">
          <el-input v-model="command.value" />
          <el-button type="danger" plain class="mt-2" @click.prevent="delCommand(command)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item
          v-for="(port, index) in imageTaskForm.image_must_export_ports"
          :key="port.key"
          :label="'必暴端口' + index"
          :prop="'port.' + index + '.value'">
        <div style="display: flex; flex-direction: row; justify-content:space-between; width: 100%">
          <el-input v-model="port.value" />
          <el-button type="danger" plain class="mt-2" @click.prevent="delPort(port)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="addCommand" type="warning">新增指令填写行</el-button>
        <el-button type="danger" @click="submitImagePullTask">提交表单</el-button>
        <el-button @click="addPort" type="warning">新增端口填写行</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import {postPullImageTask, ImagePullReq} from '../../../api/admin'
import {ref} from 'vue'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'

interface StrNum {
  key: number
  value: string
}

interface NumNum {
  key: number
  value: number
}

const formRef = ref<FormInstance>()
const imageTaskForm = ref<{image_name: string, image_tag: string, image_enabled_commands: StrNum[], image_must_export_ports: NumNum[]}>({image_name: '', image_tag: '', image_enabled_commands: [], image_must_export_ports: []})

// 提交拉取镜像任务
async function submitImagePullTask() {
  // 准备请求参数
  let my_form: ImagePullReq = {image_name: imageTaskForm.value.image_name, image_tag: imageTaskForm.value.image_tag, image_must_export_ports: [], image_enabled_commands: []}
  for (let i = 0; i < imageTaskForm.value.image_enabled_commands.length; i++) {
    my_form.image_enabled_commands.push(imageTaskForm.value.image_enabled_commands[i].value)
  }
  for (let i = 0; i < imageTaskForm.value.image_must_export_ports.length; i++) {
    my_form.image_must_export_ports.push(imageTaskForm.value.image_must_export_ports[i].value)
  }

  // 发送请求
  const res = await postPullImageTask(my_form)
  if (res.code !== 200) {
    ErrorInfo(res.msg)
    return
  }

  // 复原拉取表
  imageTaskForm.value = {image_name: '', image_tag: '', image_enabled_commands: [], image_must_export_ports: []}
  SuccessInfo('提交拉取任务成功，等待后台处理！')
}

// 新增指令行
const addCommand = () => {
  imageTaskForm.value.image_enabled_commands.push({
    key: Date.now(),
    value: '',
  })
}

// 删除指令行
const delCommand = (item: StrNum) => {
  const idx = imageTaskForm.value.image_enabled_commands.indexOf(item)
  if (idx !== -1) {
    imageTaskForm.value.image_enabled_commands.splice(idx, 1)
  }
}

// 新增端口行
const addPort = () => {
  imageTaskForm.value.image_must_export_ports.push({
    key: Date.now(),
    value: 0
  })
}

// 删除端口行
const delPort = (item: NumNum) => {
  const idx = imageTaskForm.value.image_must_export_ports.indexOf(item)
  if (idx !== -1) {
    imageTaskForm.value.image_must_export_ports.splice(idx, 1)
  }
}

</script>

<style scoped>
.linux_pull_form {
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
