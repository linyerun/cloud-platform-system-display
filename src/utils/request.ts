import axios from 'axios'
import {ErrorInfo} from './notice'
import {useRouter} from 'vue-router'
import {getData, saveData, clearLocalData} from './store_data'

interface IData {
  code: number
  msg: string
  data: any
}

interface IOptions {
  url?: string
  method?: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
}

// const myBaseUrl = 'http://192.168.200.133:8888'
const myBaseUrl = 'http://localhost:8888'

export const request = (options: IOptions) => {
  return new Promise<IData>((resolve, reject) => {

    // 创建一个axios实例
    const service = axios.create({baseURL: myBaseUrl, timeout: 60000})

    // 请求拦截器
    service.interceptors.request.use(
        (config: any) => {
          // 获取token
          const token = getData('Authorization')
          if (token) {
            config.headers['Authorization'] = token
          }
          return config
        },
        (error) => {
          Promise.reject(error).then(r => {console.log('reject err', r)})
        }
    )

    // 响应拦截器
    service.interceptors.response.use(
        async (response: any) => {
          if (response.data.code === 4001 || response.data.code === 4002) {// token过期/token解析异常, 使用备用token试一试
            // 刷新token
            const ok = await refreshToken()

            // 刷新token失败
            if (!ok) {
              clearLocalData()  // 清空数据
              ErrorInfo('登录失效, 请重新进行登录!') // 打出异常信息
              await useRouter().push('/') // 跳回到首页
              return
            }

            // 重新发起请求获取数据
            return request(options)
          }

          return response.data
        },
        error => {
          ErrorInfo('请求失败(被请求拦截器拦截)')
          return Promise.reject(error)
        }
    )

    // 请求处理
    service(options).then((res) => {resolve(res as any)}).catch((error) => {reject(error)})
  })
}

async function refreshToken() {
  // 刷新token(需要结构后重命名)
  const {data: res} = await axios.create({baseURL: myBaseUrl,timeout: 60000}).put('/v5/token/refresh', null,{headers: {'Authorization': getData('RefreshAuthorization')}})

  // 刷新token失败
  if (res.code !== 200) {
    return false
  }

  // 把token保存起来
  await saveData('Authorization', res.data.token)
  await saveData('RefreshAuthorization', res.data.refresh_token)

  // 返回成功的结果
  return true
}
