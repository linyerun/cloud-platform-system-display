import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import {JsonViewer} from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(JsonViewer)

app.mount('#app')
