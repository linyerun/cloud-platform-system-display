<template>
  <el-table :data="imageList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
      <el-table-column prop="id" label="编号" width="200" />
      <el-table-column prop="creator.name" label="构建者" width="200" />
      <el-table-column prop="creator.email" label="构建者邮箱" width="200" />
      <el-table-column prop="name" label="名称" width="500" />
      <el-table-column prop="tag" label="标签" width="120" />
      <el-table-column label="大小(单位: MB)" width="200" >
        <template #default="{ row }">{{Math.round(row.size / (1024*1024))}}</template>
      </el-table-column>
      <el-table-column prop="enable_commands" label="启动指令" width="300" />
      <el-table-column prop="must_export_ports" label="必暴露端口" width="200" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="showApplicationForm(row.id, row.must_export_ports)">申请服务器</el-button>
        </template>
      </el-table-column>
    </el-table>
  <!--服务器申请单填写弹出框-->
  <el-dialog draggable v-model="linuxFormVisible" title="服务器申请表单" width="600">
    <el-form :model="linuxApplicationForm">
      <el-form-item label="服务器名称" :label-width="150">
        <el-input v-model="linuxApplicationForm.container_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="服务器内存(单位: KB)" :label-width="150">
        <el-input v-model="linuxApplicationForm.memory" autocomplete="off" />
      </el-form-item>
      <el-form-item label="服务器核心数" :label-width="150">
        <el-input v-model="linuxApplicationForm.core_count" autocomplete="off" />
      </el-form-item>
      <el-form-item label="必暴端口" :label-width="150">
        <el-input v-model="linuxApplicationForm.export_ports" disabled autocomplete="off" />
      </el-form-item>
      <el-form-item label="服务器对外暴露端口" :label-width="150">
        <el-input v-model="linuxApplicationForm.port_str" autocomplete="off" placeholder="别和必暴端口重复, 两端口间空格隔开, 总端口数不能超10"/>
      </el-form-item>
      <el-form-item label="申请理由" :label-width="150">
        <el-input v-model="linuxApplicationForm.explanation" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitLinuxApplicationForm">提交申请表单</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {getImageList, applyForLinux, Image} from '../../../api/user'
import {onBeforeMount, reactive, ref} from 'vue'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'

const imageList = reactive<Image[]>([])
const linuxApplicationForm = reactive({container_name: '', image_id: '', export_ports: [] as number[], explanation: '', memory: 102400, memory_swap: -1, core_count: 2, disk_size: 0, port_str: ''})
const linuxFormVisible = ref<boolean>(false)

// 提交Linux服务器申请单
async function submitLinuxApplicationForm() {
  // 端口字符串剪切
  const ports = linuxApplicationForm.port_str.split(' ')
  linuxApplicationForm.export_ports = []
  for (let i = 0; i < ports.length; i++) {
    // 如果端口不是正整数则忽略
    if (!/^\+?[1-9][0-9]*$/.test(ports[i])) continue

    linuxApplicationForm.export_ports.push(parseInt(ports[i]))
  }

  // 发送请求
  const res = await applyForLinux(linuxApplicationForm)

  // 申请结果处理
  if (res.code !== 200) {
    // 申请失败
    ErrorInfo(res.msg)
  }else {
    // 申请成功
    SuccessInfo('申请服务器成功, 等待你的管理员处理申请')
  }

  // 关闭弹窗
  linuxFormVisible.value = false
}

// 展示申请单
function showApplicationForm(imageId: string, ports: number[]) {
  // 初始化表单
  linuxApplicationForm.container_name = ''
  linuxApplicationForm.explanation = ''
  linuxApplicationForm.port_str = ''
  linuxApplicationForm.memory = 102400
  linuxApplicationForm.core_count = 2

  linuxApplicationForm.image_id = imageId
  linuxApplicationForm.export_ports = ports
  linuxFormVisible.value = true
}

// 获取数据并渲染
onBeforeMount(async ()=>{
  const res = await getImageList()

  // 处理异常
  if (res.code !== 200) {
    ErrorInfo('获取数据失败, err='+res.msg)
    return
  }

  imageList.push.apply(imageList, res.data.images)
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: Image, rowIndex: number }) => {
  if (rowIndex%4 === 0) {
    return 'warning-row'
  } else if (rowIndex%4 === 2) {
    return 'success-row'
  }
  return ''
}

</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
