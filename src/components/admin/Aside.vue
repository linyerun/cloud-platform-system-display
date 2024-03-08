<template>
  <el-menu :default-openeds="['1']" :default-active="path" router style="width:250px; height: calc(100vh - 50px);"
           class="el-menu-vertical-demo">
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Operation/>
        </el-icon>
        <span>申请处理模块</span>
      </template>
      <el-menu-item index="/admin/application_linux_list">服务器申请单列表</el-menu-item>
      <el-menu-item index="/admin/application_user_list">游客的申请单列表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <IconMenu/>
        </el-icon>
        <span>镜像模块</span>
      </template>
      <el-menu-item index="/admin/linux_image_list">服务器镜像列表</el-menu-item>
      <el-menu-item index="/admin/linux_image_pull">服务器镜像拉取</el-menu-item>
      <el-menu-item index="/admin/db_image_list">数据库镜像列表</el-menu-item>
      <el-menu-item index="/admin/db_image_pull">数据库镜像拉取</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <IconMenu/>
        </el-icon>
        <span>任务模块</span>
      </template>
      <el-menu-item index="/admin/task_async_list">异步任务列表</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import {Menu as IconMenu, Operation} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'
import {ref} from 'vue'

const route = useRoute()

const path = ref<string>(route.path)

</script>
