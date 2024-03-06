<template>
  <div class="login">
    <div class="loginPart">
      <h2>登录</h2>
      <el-form>
        <div class="inputElement">
          <el-input v-model="email" placeholder="请输入邮箱地址"></el-input>
        </div>
        <div class="inputElement" style="margin-top: 10px;">
          <el-input v-model="password" placeholder="请输入密码" type="password"></el-input>
        </div>
        <div class="inputElement" style="margin-top: 10px;">
          <el-input v-model="captcha" placeholder="请输入验证码"></el-input>
        </div>
        <div style="text-align:center; margin-top: 10px">
          <el-button type="primary" @click="loginFunc">登录</el-button>
          <el-button type="warning" @click="getCaptchaByEmail">获取验证码</el-button>
          <el-button type="danger" @click="registerFunc">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {login, sendCaptchaToEmail} from '../../api/v0'
import {ErrorInfo, SuccessInfo} from '../../utils/notice'
import {saveData, getData} from '../../utils/store_data'

const email = ref<string>('')
const password = ref<string>('')
const captcha = ref<string>('')
const router = useRouter()

const loginFunc = async () => {
  // 校验参数
  if(email.value === '' || password.value === '' || captcha.value === '') {
    ErrorInfo('请输入完整信息')
    return
  }

  // 发送登录请求
  let res = await login(email.value, password.value, captcha.value)
  if(res.code !== 200) {  // 异常
    ErrorInfo(res.msg)
    return
  }

  // 保存token
  saveData('Authorization', res.data.token)
  saveData('RefreshAuthorization', res.data.refresh_token)

  // 保存用户信息
  saveData('user_name', res.data.user.name)
  saveData('user_email', res.data.user.email)
  saveData('user_auth', res.data.user.auth)

  // 调整到对应用户的主页
  switch(res.data.user.auth) {
    case 0:
      await router.push('/visitor/user')
      break
    case 1:
      await router.push('/user/image_linux')
      break
    case 2:
      await router.push('/admin')
      break
    case 3:
      await router.push('/super')
      break
    default:
      ErrorInfo('跳转失败')
  }
}
const registerFunc = () => { router.push('/register') }
const getCaptchaByEmail = () => {
  // 校验邮箱
  if(email.value === '') {
    ErrorInfo('请输入邮箱地址，不然无法发送验证码')
    return
  }

  // 发送请求
  sendCaptchaToEmail(email.value).then(res => {
    if(res.code !== 200) {
      ErrorInfo(res.msg)
      ErrorInfo('发送验证码失败，请稍后再尝试')
      return
    }
    SuccessInfo('发送验证码成功请注意查收')
  })
}

</script>

<style scoped>
.loginPart {
  position: absolute;
  /*定位方式绝对定位absolute*/
  top: 50%;
  left: 50%;
  /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
  transform: translate(-50%, -50%);
  /*实现块元素百分比下居中*/
  width: 450px;
  padding: 50px;
  background: rgba(0, 0, 0, .5);
  /*背景颜色为黑色，透明度为0.8*/
  box-sizing: border-box;
  /*box-sizing设置盒子模型的解析模式为怪异盒模型，
  将border和padding划归到width范围内*/
  box-shadow: 0 15px 25px rgba(0, 0, 0, .5);
  /*边框阴影  水平阴影0 垂直阴影15px 模糊25px 颜色黑色透明度0.5*/
  border-radius: 15px;
  /*边框圆角，四个角均为15px*/
}

.loginPart h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
  /*文字居中*/
}

.loginPart .inputElement input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  letter-spacing: 1px;
  /*字符间的间距1px*/
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  /*outline用于绘制元素周围的线
  outline：none在这里用途是将输入框的边框的线条使其消失*/
  background: transparent;
  /*背景颜色为透明*/
}
</style>
