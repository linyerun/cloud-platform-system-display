<template>
  <div class="add-admin-form">
    <el-form ref="formRef" style="max-width: 600px" :model="userForm" label-width="auto" class="demo-dynamic">
      <el-form-item prop="email" label="邮箱地址">
        <el-input v-model="userForm.email" />
      </el-form-item>
      <el-form-item prop="name" label="用户名称">
        <el-input v-model="userForm.name" />
      </el-form-item>
      <el-form-item prop="password" label="登录密码">
        <el-input v-model="userForm.password" />
      </el-form-item>
      <el-form-item>
        <div class="btn-line">
          <el-button type="primary" @click="submitData">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {AdminDataReq, createAdmin} from '../../../api/super'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'
import {ref} from 'vue'

const userForm = ref<AdminDataReq>({email: '', name: '', password: '123456'})

async function submitData() {
  // 发送请求
  const res = await createAdmin(userForm.value)
  if (res.code !== 200) {
    ErrorInfo('创建管理员失败')
    ErrorInfo(res.msg)
    return
  }

  // 显示成功
  SuccessInfo('新增管理员成功')
  userForm.value = {email: '', name: '', password: '123456'}
}

</script>

<style scoped>
.add-admin-form {
  position: absolute;
  /*定位方式绝对定位absolute*/
  top: 50%;
  left: 50%;
  /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
  transform: translate(-50%, -50%);
  /*背景颜色*/
  background: rgb(255, 255, 255);
}
.btn-line {
  position: absolute;
  /*定位方式绝对定位absolute*/
  top: 50%;
  left: 50%;
  /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
  transform: translate(-50%, -50%);
}
</style>
