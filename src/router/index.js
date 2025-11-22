// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

// 我们先把默认的 Home 页面当作我们的首页
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Archive from '@/views/Archive.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import Pic_share from '@/views/Picshare.vue'
import Anime from '@/views/Anime.vue'
import MessageBoard from '@/views/MessageBoard.vue'
// 定义路由规则数组
const routes = [
  // 当访问 '/' 根路径时，加载 Home 组件
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/archive', name: 'Archive', component: Archive }, // 可加 name 方便跳转
  { path: '/post/:slug', name: 'ArticleDetail', component: ArticleDetail, props: true },
  { path: '/pic_share', name: 'Pic_share', component: Pic_share },
  { path: '/anime', name: 'Anime', component: Anime },
  { path: '/message_board', name: 'MessageBoard', component: MessageBoard },
]

// 创建路由器实例
const router = createRouter({
  // 使用 HTML5 History 模式（好看一点的地址）
  history: createWebHashHistory(), // 改为 Hash 模式
  routes, // 把上面定义的 routes 数组传进来
})

// 导出路由器实例供 main.js 使用
export default router
