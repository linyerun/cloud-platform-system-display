<template>
  <el-menu :default-openeds="['1']" :default-active="path" router style="width:250px; height: calc(100vh - 50px);"
           class="el-menu-vertical-demo">
    <el-sub-menu index="1" style="width: 250px">
      <template #title>
        <el-icon>
          <Operation/>
        </el-icon>
        <span>镜像模块</span>
      </template>
      <el-menu-item index="/user/image_linux">服务器镜像</el-menu-item>
      <el-menu-item index="/user/image_db">数据库镜像</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2" style="width: 250px">
      <template #title>
        <el-icon>
          <IconMenu/>
        </el-icon>
        <span>我的容器</span>
      </template>
      <el-menu-item index="/user/container_linux">我的服务器</el-menu-item>
      <el-menu-item index="/user/container_db">我的数据库</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3" style="width: 250px">
      <template #title>
        <el-icon>
          <IconMenu/>
        </el-icon>
        <span>我的申请</span>
      </template>
      <el-menu-item index="/user/application_linux">服务器申请单</el-menu-item>
      <el-menu-item index="/user/application_db">数据库申请</el-menu-item>
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
