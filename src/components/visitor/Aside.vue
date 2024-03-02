<template>
  <el-menu :default-openeds="['1']" :default-active="path" router style="width:250px; height: calc(100vh - 50px);"
           class="el-menu-vertical-demo">
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Operation/>
        </el-icon>
        <span>信息管理</span>
      </template>
      <el-menu-item index="/admin/client">客户信息管理</el-menu-item>
      <el-menu-item index="/admin/employee">销售人员管理</el-menu-item>
      <el-menu-item index="/admin/contract">合同信息管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <IconMenu/>
        </el-icon>
        <span>进发货管理</span>
      </template>
      <el-menu-item index="/admin/purchaseOrder">进货单生成</el-menu-item>
      <el-menu-item index="/admin/dispatchBill">发货单处理</el-menu-item>
      <el-menu-item index="/admin/addGoods">新增&nbsp;&nbsp;&nbsp;货物</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <Document/>
        </el-icon>
        <span>销售数据统计</span>
      </template>
      <el-menu-item index="/admin/sum">销售的总额查询</el-menu-item>
      <el-menu-item index="/admin/goodsSum">商品销售额查询</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import {Menu as IconMenu, Document, Operation} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'
import {ref} from 'vue'

const route = useRoute()

const path = ref<string>(route.path)

</script>
