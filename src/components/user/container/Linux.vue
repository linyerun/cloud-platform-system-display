<template>
  <el-table :data="linuxInstanceList" style="width: 100%;height: 625px" border :row-class-name="tableRowClassName">
      <el-table-column label="服务器状态" width="200">
        <template #default="{ row }">
          <el-button v-if="row.status === 0" type="danger" link>休眠中</el-button>
          <el-button v-else-if="row.status === 1" type="success" link>运行中</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="user_container_name" label="名称" width="200" />
      <el-table-column prop="host" label="主机IP地址" width="200" />
      <el-table-column prop="init_username" label="初始化账户" width="200" />
      <el-table-column prop="init_password" label="初始化密码" width="200" />
      <el-table-column label="ssh连接端口" width="200">
        <template #default="{ row }">
          {{row.my_ports_mapping.get(22)}}
        </template>
      </el-table-column>
      <el-table-column prop="memory" label="内存大小(单位: KB)" width="200" />
      <el-table-column prop="core_count" label="核心数量" width="200" />
      <el-table-column label="创建时间" width="300">
        <template #default="{ row }">
          {{new Date(row.create_at).getFullYear()}}年{{new Date(row.create_at).getMonth()+1}}月{{new Date(row.create_at).getDate()}}日{{new Date(row.create_at).getHours()}}时{{new Date(row.create_at).getMinutes()}}分{{new Date(row.create_at).getSeconds()}}秒
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="320">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="closeMyLinux(row)" round plain>休眠</el-button>
          <el-button type="success" size="small" @click="startMyLinux(row)" round>开启</el-button>
          <el-button type="danger" size="small" @click="removeMyLinux(row.id)" round>删除</el-button>
          <el-button type="primary" size="small" @click="showPortsMapping(row.my_ports_array)" round>查看端口映射表</el-button>
        </template>
      </el-table-column>
    </el-table>
  <!--端口映射表弹窗-->
  <el-dialog draggable v-model="kvArrayVisible" title="端口映射表" width="500">
    <el-table :data="kvArray">
      <el-table-column property="key" label="虚拟服务器端口" width="200" />
      <el-table-column property="value" label="真实服务器提供的端口" width="200" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import {getLinuxInstanceList, changeLinuxStatus, deleteLinux, Image, LinuxInstance, KV} from '../../../api/user'
import {ErrorInfo, SuccessInfo} from '../../../utils/notice'

const kvArrayVisible = ref<boolean>(false)
const kvArray = ref<KV[]>([])
const linuxInstanceList = ref<LinuxInstance[]>([])

// 关闭服务器
async function closeMyLinux(instance: LinuxInstance) {

  const id = instance.id
  const res = await changeLinuxStatus(id, 0)

  if (res.code !== 200) {
    ErrorInfo('关闭服务器失败: '+res.msg)
    return
  }

  instance.status = 0
  SuccessInfo('关闭服务器成功!')
}

// 开启服务器
async function startMyLinux(instance: LinuxInstance) {

  const id = instance.id
  const res = await changeLinuxStatus(id, 1)

  if (res.code !== 200) {
    ErrorInfo('开启服务器失败: '+res.msg)
    return
  }

  instance.status = 1
  SuccessInfo('开启服务器成功!')
}

// 删除服务器
async function removeMyLinux(id: string) {

  // 发送删除请求
  const res = await deleteLinux(id)

  if (res.code !== 200) {
    ErrorInfo('服务器删除失败: '+res.msg)
    return
  }

  // 更新列表数据
  linuxInstanceList.value = linuxInstanceList.value.filter((cur)=>{return cur.id !== id})
  SuccessInfo('服务器删除成功!')
}

// 展示端口映射表
function showPortsMapping(pm: KV[]) {
  kvArray.value = pm
  kvArrayVisible.value = true
}

// 获取数据并渲染
onBeforeMount(async ()=>{
  // 获取申请列表
  const res = await getLinuxInstanceList()

  // 处理异常
  if (res.code !== 200) {
    ErrorInfo('获取数据失败, err='+res.msg)
    return
  }

  // 插入列表
  linuxInstanceList.value = res.data.linux_containers

  // 处理ports_mapping
  for (let i = 0; i < linuxInstanceList.value.length; i++) {
    let obj = linuxInstanceList.value[i]

    // 初始化自定义变量
    obj.my_ports_mapping = new Map<number, number>()
    obj.my_ports_array = new Array<KV>()

    // 遍历obj的ports_mapping
    const arr = Object.entries(obj.ports_mapping)
    for (let j = 0; j < arr.length; j++) {
      let keyPort = parseInt(arr[j][0])
      let valPort = arr[j][1]

      obj.my_ports_mapping.set(valPort, keyPort)
      obj.my_ports_array.push({key: valPort, value: keyPort})
    }
  }
})

// 影响行的颜色
const tableRowClassName = ({row, rowIndex}: { row: LinuxInstance, rowIndex: number }) => {
  if (row.status === 0) {
    return 'danger-row'
  } else if (row.status === 1) {
    return 'success-row'
  }
  return ''
}
</script>

<style>
.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
