import axios from 'axios'
import {ErrorInfo} from '../utils/notice'
import router from '../router/index'
import {getData, saveData} from './store_data'

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

export const request = (options: IOptions) => {
  return new Promise<IData>((resolve, reject) => {

    // 创建一个axios实例
    const service = axios.create({
      // baseURL: 'http://192.168.200.133:8888',
      baseURL: 'http://localhost:8888',
      timeout: 60000
    })

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
        error => {
          console.log("err: ", error) // for debug
          Promise.reject(error).then(r => {console.log('reject')})
        }
    )

    // 响应拦截器
    service.interceptors.response.use(
        async (response: any) => {
          if (response.data.code === 4001) {// token过期
            // 刷新token
            await refreshToken()
            // 重新发起请求获取数据
          }else if  (response.data.code === 4002) {// token解析异常, 无药可救
            ErrorInfo('token失效, 请重新进行登录!')
            router.push('/login').then(r => console.log(r))
          }
          return response.data
        },
        error => {
          console.log('err: ' + error) // for debug
          if (error.response.status == 403) {
            ErrorInfo('错了')
          } else {
            ErrorInfo('服务器请求错误，请稍后再试')
          }
          return Promise.reject(error)
        }
    )

    // 请求处理
    service(options)
        .then((res) => {resolve(res as any)})
        .catch((error) => {reject(error)})
  })
}

async function refreshToken() {
  // 刷新token
  let res = await axios.create({baseURL: 'http://192.168.200.133:8888',timeout: 60000}).get('/v5/token/refresh', {headers: {Authorization: getData('RefreshAuthorization')}})

  // 把token保存起来
  saveData('Authorization', res.data.token)
  saveData('RefreshAuthorization', res.data.refresh_token)
}
