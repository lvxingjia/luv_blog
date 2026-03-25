<template>
  <div id="app">
    <!-- 顶部标题 -->
    <HeroHeader
      :normal-title="blogTitle"
      :is-hero="isHomePage"
      :hero-title="blogTitle"
      :hero-subtitle="blogSubtitle"
    />

    <div class="main-container">
      <!-- 左侧导航栏 -->
      <aside class="left-sidebar">
        <Sidebar :nav-items="navItems" />
        <!-- RAG 搜索组件放在 Sidebar 下方 -->
        <RAGSearch />
      </aside>

      <!-- 中间主要内容 -->
      <main class="content">
        <!-- 欢迎区域 -->
        <router-view />
      </main>

      <!-- 右侧个人信息 -->
      <aside class="right-sidebar">
        <ProfileSidebar :profile="profile" :tags="tags" />
      </aside>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 {{ blogTitle }}. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import RAGSearch from './components/RAGSearch.vue'
import Sidebar from './components/Sidebar.vue'
import ProfileSidebar from './components/ProfileSidebar.vue'
import HeroHeader from './components/HeroHeader.vue'
import { articles } from '../data/articles'
export default {
  name: 'App',
  components: {
    Sidebar, // 注册 Sidebar 组件
    ProfileSidebar, // 注册 ProfileSidebar 组件
    HeroHeader, // 注册 HeroHeader 组件
    RAGSearch, // 注册 RAGSearch 组件
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/' // 仅首页启用 Hero
    },
  },
  data() {
    return {
      // 导航菜单
      navItems: [
        { id: 1, text: '首页', link: '/', icon: 'fas fa-home' },
        { id: 2, text: '文章归档', link: '/archive', icon: 'fas fa-archive' },
        { id: 3, text: '动漫锐评', link: '/anime', icon: 'fas fa-pen' },
        { id: 4, text: '美图分享', link: '/pic_share', icon: 'fas fa-camera' },
        { id: 6, text: '留言板', link: '/message_board', icon: 'fas fa-comments' },
        { id: 5, text: '关于我', link: '/about', icon: 'fas fa-user' },
        { id: 7, text: '原神启动', link: 'https://ys.mihoyo.com/main', icon: 'fas fa-plane' },
      ],

      blogTitle: 'Luv的BLOG（并非）',
      blogSubtitle: '欢迎访问我的网站\n记录生活，分享点滴，\n下滑查看更多喵~',
      // 分类
      categories: ['生活随笔', '旅行日记', '读书笔记', '摄影作品', '技术分享', '美食记录'],

      // 最新动态
      recentUpdates: [
        { id: 1, date: '26-03-24', text: '上传了第一篇正经blog' },
        { id: 2, date: '25-11-21', text: '开发了这个网站' },
        { id: 3, date: '25-10-27', text: '玩了甜蜜女友3' },
      ],

      // 文章列表

      // 个人信息
      profile: {
        name: 'Luv',
        bio: 'WEB即将迎来二次元的大变喵',
        stats: {
          articles: articles.length,
          categories: 45,
          words: '1.4万',
        },
        socialLinks: [
          { name: 'github', url: 'https://github.com/lvxingjia', icon: 'fab fa-github' },

          { name: 'twitter', url: 'https://x.com/lxj050603', icon: 'fab fa-twitter' },
        ],
        contact: {
          email: 'lvxingjia0603@gmail.com',
          location: '中国 · 江苏',
        },
      },

      // 标签
      tags: ['生活', '代码', '宅宅', '读书', '美食', '动漫', '游戏', '漫画', '小说', '旮罗game'],
    }
  },
  methods: {
    getTagSize(tag) {
      const sizes = ['12px', '14px', '16px', '18px', '20px']
      const index = tag.length % sizes.length
      return sizes[index]
    },
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 主容器布局 */
.main-container {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  overflow: hidden; /* 防止外层滚动 */
}

/* 左侧 Sidebar 和 RAG 搜索容器 */
.left-sidebar {
  width: 300px;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 主内容区可滚动 */
}

/* 右侧个人信息容器 */
.right-sidebar {
  width: 300px;
  overflow-y: auto;
  flex-shrink: 0;
}

/* 页脚 */
.footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 2rem 0;
  margin-top: 3rem;
}

/* 响应式设计 - 仅保留对 main-container 的调整 */
@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
    align-items: center;
  }
  
  .left-sidebar {
    width: 100%;
  }
  
  .right-sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 0 1rem;
  }
  
  .left-sidebar {
    width: 100%;
  }
  
  .right-sidebar {
    width: 100%;
  }
}
</style>
