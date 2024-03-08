# 项目介绍: 虚拟云服务系统
# 项目技术栈: Vue 3 + TypeScript + Vite
# localStorage vs sessionStorage
- localStorage: 有效期是在不进行手动删除的情况下是一直有效的。
- sessionStorage: 有效期是仅保持在当前页面，关闭当前会话页、关闭浏览器后就会失效。
# TODO List
# Bug记录
## 使用原生axios发请求没有进行解构重命名
- const {data: res} = await axios.create({baseURL: myBaseUrl,timeout: 60000}).put('/v5/token/refresh', null,{headers: {'Authorization': token}})
  - 如果直接 `const res = xxxx`，那么获取获取后端返回的code需要: `res.data.code`
## flex
- 想要给Aside加宽度，那就得给router-view加上 `flex: 1`
```vue
<div style="display: flex">
  <Aside/>
  <router-view style="flex: 1"/>
</div>
```
