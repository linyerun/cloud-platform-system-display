<template>
  <div style="height:50px; line-height: 50px; border-bottom: 1px solid #ccc; display: flex;">
    <div style="width:300px; padding-left: 30px; font-weight: bold; color: dodgerblue;">
      公司销售管理系统 - {{ userType }}操作界面
    </div>
    <div style="flex: 1;"></div>
    <div style="width:100px;">
      <el-dropdown>
                <span class="el-dropdown-link" style="line-height: 50px">
                    {{ username }}
                    <el-icon class="el-icon--right">
                        <arrow-down/>
                    </el-icon>
                </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="exit">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {ArrowDown} from '@element-plus/icons-vue'

const props = defineProps<{
  userType: string
}>()
// 在setup语法糖里面这样用
// console.log(props.userType)

const router = useRouter()
const username = ref<string>('')

const exit = () => {
  // 清除缓存
  sessionStorage.clear()
  localStorage.clear()
  // 进行路由跳转
  router.push({path: '/login'})
}
</script>
