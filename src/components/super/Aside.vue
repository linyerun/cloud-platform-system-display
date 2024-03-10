<template>
  <el-menu :default-openeds="['1']" :default-active="path" router style="width:250px; height: calc(100vh - 50px);"
           class="el-menu-vertical-demo">
    <el-sub-menu index="1" style="width: 250px">
      <template #title>
        <el-icon>
          <IconMenu/>
        </el-icon>
        <span>管理员模块</span>
      </template>
      <el-menu-item index="/super/add_admin">新增管理员</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2" style="width: 250px">
      <template #title>
        <el-icon>
          <Operation/>
        </el-icon>
        <span>异常模块</span>
      </template>
      <el-menu-item index="/super/error_list">异常信息列表</el-menu-item>
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
