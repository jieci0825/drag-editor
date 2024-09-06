import { createApp } from 'vue'
import './style.css'
import 'element-plus/dist/index.css'
import App from './App.vue'

import Editor from './package'

const app = createApp(App)
app.use(Editor)
app.mount('#app')
