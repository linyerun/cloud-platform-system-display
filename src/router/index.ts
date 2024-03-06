import { createRouter, createWebHistory } from 'vue-router'
import { getData } from '../utils/store_data'
import { ErrorInfo } from '../utils/notice'

import Login from '../components/common/Login.vue'
import Register from '../components/common/Register.vue'

import VisitorIndex from '../components/visitor/Index.vue'
import VisitorIntroUser from '../components/visitor/introduce/User.vue'
import VisitorIntroFunc from '../components/visitor/introduce/Function.vue'
import VisitorIntroApply from '../components/visitor/introduce/Application.vue'
import VisitorApplicationApply from '../components/visitor/application/Apply.vue'

import UserIndex from '../components/user/Index.vue'
import UserImageLinux from '../components/user/image/Linux.vue'
import UserImageDb from '../components/user/image/Db.vue'
import UserContainerLinux from '../components/user/container/Linux.vue'
import UserContainerDb from '../components/user/container/Db.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/visitor',
    name: 'VisitorIndex',
    component: VisitorIndex,
    children: [
      {
        path: 'user',
        name: 'UserIntro',
        component: VisitorIntroUser
      },
      {
        path: 'function',
        name: 'FunctionIntro',
        component: VisitorIntroFunc
      },
      {
        path: 'apply',
        name: 'ApplyIntro',
        component: VisitorIntroApply
      },
      {
        path: 'apply_msg',
        name: 'ApplicationMsgInput',
        component: VisitorApplicationApply
      }
    ]
  },
  {
    path: '/user',
    name: 'UserIndex',
    component: UserIndex,
    children: [
      {
        path: 'image_linux',
        name: 'ImageLinux',
        component: UserImageLinux
      },
      {
        path: 'image_db',
        name: 'ImageDb',
        component: UserImageDb
      },
      {
        path: 'container_linux',
        name: 'ContainerLinux',
        component: UserContainerLinux
      },
      {
        path: 'container_db',
        name: 'ContainerDb',
        component: UserContainerDb
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// 做一个页面跳转守门员, 到达之前判断是否有Token
router.beforeEach((to, from, next) => {
  // 打印跳转日志
  console.log(from.path + " => " + to.path)

  // 允许没token也可以跳转的页面
  if (to.path === '/login' || to.path === '/register') return next()

  // 需要检查token的
  const token = getData('Authorization')
  if (token === null) return next('/login')

  // 用户的界面-权限对应起来
  const auth = parseInt(getData('user_auth') as string)

  if (auth == 0 && !to.path.startsWith('/visitor')) { // 游客
    ErrorInfo('权限不足, 无法跳转')
    return
  }
  if (auth == 1 && !to.path.startsWith('/user')) { // 用户
    ErrorInfo('权限不足, 无法跳转')
    return
  }
  if (auth == 2 && !to.path.startsWith('/admin')) { // 管理员
    ErrorInfo('权限不足, 无法跳转')
    return
  }
  if (auth == 3 && !to.path.startsWith('/super')) { // 超级管理员
    ErrorInfo('权限不足, 无法跳转')
    return
  }

  // 允许通过
  next()
})

export default router
