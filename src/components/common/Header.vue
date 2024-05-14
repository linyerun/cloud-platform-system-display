<template>
  <div style="height:50px; line-height: 50px; border-bottom: 1px solid #ccc; display: flex;">
    <div style="width:300px; padding-left: 30px; font-weight: bold; color: dodgerblue;">
      虚拟云服务器系统 - {{ userType }}操作界面
    </div>
    <div style="flex: 1;"></div>
    <div style="margin-right: 30px">
      <el-dropdown>
                <span class="el-dropdown-link" style="line-height: 50px">
                    {{ uname }}
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
import {ref, onBeforeMount} from 'vue'
import {useRouter} from 'vue-router'
import {getData, clearLocalData} from '../../utils/store_data'
import {ArrowDown} from '@element-plus/icons-vue'

defineProps<{ userType: string }>()

const router = useRouter()
const uname = ref<string>('')

const exit = () => {
  // 清除缓存
  clearLocalData()

  // 进行路由跳转
  router.push({path: '/'})
}

// 初始化uname的值
onBeforeMount(()=>{
  uname.value = getData('user_name') as string
})


</script>
