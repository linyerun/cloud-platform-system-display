<template>
  <el-menu :default-openeds="['1']" :default-active="path" router style="width:250px; height: calc(100vh - 50px);"
           class="el-menu-vertical-demo">
    <el-sub-menu index="1" style="width: 250px">
      <template #title>
        <el-icon>
          <Operation/>
        </el-icon>
        <span>系统介绍</span>
      </template>
      <el-menu-item index="/visitor/user">用户介绍</el-menu-item>
      <el-menu-item index="/visitor/function">功能介绍</el-menu-item>
      <el-menu-item index="/visitor/apply">申请流程</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2" style="width: 250px">
      <template #title>
        <el-icon>
          <IconMenu/>
        </el-icon>
        <span>申请模块</span>
      </template>
      <el-menu-item index="/visitor/apply_msg">申请资料填写</el-menu-item>
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
