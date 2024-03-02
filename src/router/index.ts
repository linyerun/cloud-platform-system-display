import {createRouter, createWebHistory} from 'vue-router'
import Login from '../components/common/Login.vue'
import Register from '../components/common/Register.vue'
import VisitorIndex from '../components/visitor/Index.vue'

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
  // 运行没token跳转的页面
  if (to.path === '/login' || to.path === '/register') return next()
  // 需要检查token的
  const token = sessionStorage.getItem('Authorization')
  if (token === null) return next('/login')
  next() // 允许通过
})

export default router
