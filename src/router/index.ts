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
import UserApplicationLinux from '../components/user/application/Linux.vue'
import UserApplicationDb from '../components/user/application/Db.vue'

import AdminIndex from '../components/admin/Index.vue'
import AdminLinuxApplicationList from '../components/admin/application/LinuxList.vue'
import AdminDbApplicationList from '../components/admin/application/DbList.vue'
import AdminUserApplicationList from '../components/admin/application/UserList.vue'
import AdminLinuxImageList from '../components/admin/image/LinuxList.vue'
import AdminLinuxImagePull from '../components/admin/image/LinuxPull.vue'
import AdminLinuxDbList from '../components/admin/image/DbList.vue'
import AdminLinuxDbPull from '../components/admin/image/DbPull.vue'
import AdminAsyncTaskList from '../components/admin/task/AsyncList.vue'

import SuperIndex from '../components/super/Index.vue'
import SuperAdminAdd from '../components/super/admin/AdminAdd.vue'
import SuperErrorList from '../components/super/error/ErrorList.vue'

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
      },
      {
        path: 'application_linux',
        name: 'ApplicationLinux',
        component: UserApplicationLinux
      },
      {
        path: 'application_db',
        name: 'ApplicationDb',
        component: UserApplicationDb
      },
    ]
  },
  {
    path: '/admin',
    name: 'AdminIndex',
    component: AdminIndex,
    children: [
      {
        path: 'application_linux_list',
        name: 'ApplicationLinuxList',
        component: AdminLinuxApplicationList
      },
      {
        path: 'application_db_list',
        name: 'ApplicationDbList',
        component: AdminDbApplicationList
      },
      {
        path: 'application_user_list',
        name: 'ApplicationUserList',
        component: AdminUserApplicationList
      },
      {
        path: 'linux_image_list',
        name: 'LinuxImageList',
        component: AdminLinuxImageList
      },
      {
        path: 'linux_image_pull',
        name: 'LinuxImagePull',
        component: AdminLinuxImagePull
      },
      {
        path: 'db_image_list',
        name: 'DbImageList',
        component: AdminLinuxDbList
      },
      {
        path: 'db_image_pull',
        name: 'DbImagePull',
        component: AdminLinuxDbPull
      },
      {
        path: 'task_async_list',
        name: 'TaskAsyncList',
        component: AdminAsyncTaskList
      },
    ]
  },
  {
    path: '/super',
    name: 'SuperIndex',
    component: SuperIndex,
    children: [
      {
        path: 'error_list',
        name: 'ErrorList',
        component: SuperErrorList
      },
      {
        path: 'add_admin',
        name: 'AddAdmin',
        component: SuperAdminAdd
      }
    ]
  }
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
