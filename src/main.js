// src/main.js
import { createApp } from 'vue'
// 1. 引入路由模块
import router from './router'
import App from './App.vue'

// 2. 创建 Vue 应用实例，并使用路由插件，最后挂载到 #app 元素上
createApp(App).use(router).mount('#app')
