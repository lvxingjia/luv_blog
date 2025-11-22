<!-- src/components/Sidebar.vue -->
<template>
  <nav class="sidebar">
    <div class="nav-section">
      <h3>导航菜单</h3>
      <ul class="nav-menu">
        <li v-for="item in navItems" :key="item.id" class="nav-item">
          <!-- 判断是否为外链（以 http 开头） -->
          <template v-if="item.link.startsWith('http')">
            <a :href="item.link" target="_blank" rel="noopener noreferrer" class="nav-link">
              <i :class="item.icon"></i>
              {{ item.text }}
            </a>
          </template>

          <!-- 内部路由 -->
          <template v-else>
            <router-link :to="item.link" class="nav-link" active-class="active" exact>
              <i :class="item.icon"></i>
              {{ item.text }}
            </router-link>
          </template>
        </li>
      </ul>
    </div>

    <!-- 其他部分保持不变 -->
    <div class="nav-section">
      <h3>文章分类</h3>
      <div class="categories">
        <span v-for="category in categories" :key="category" class="category-tag">
          {{ category }}
        </span>
      </div>
    </div>

    <div class="nav-section">
      <h3>最新动态</h3>
      <div class="recent-updates">
        <div v-for="update in recentUpdates" :key="update.id" class="update-item">
          <span class="update-date">{{ update.date }}</span>
          <p class="update-text">{{ update.text }}</p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    navItems: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    recentUpdates: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped>
/* Sidebar 组件自己的样式 */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  padding: 24px 20px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px); /* 可选：毛玻璃效果（需父容器透明背景） */
  overflow-y: auto;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #4b5563;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  text-decoration: none;
  color: #4b5563;
  border-radius: 12px;
  transition: all 0.25s ease;
  font-size: 14px;
  font-weight: 500;
}

.nav-link:hover {
  background-color: #eef2ff;
  color: #4f46e5;
  transform: translateX(4px);
}

/* 激活状态：使用更柔和的主色调 */
:deep(.nav-link.active) {
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white !important;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  transform: translateX(4px);
}

/* 图标微调（假设你用的是 Font Awesome 或类似） */
.nav-link i {
  font-size: 16px;
  width: 18px;
  text-align: center;
  opacity: 0.85;
}

.nav-link:hover i,
:deep(.nav-link.active) i {
  opacity: 1;
}

/* 分类标签 */
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
}

.category-tag:hover {
  background: #dbeafe;
  color: #2563eb;
  border-color: #bfdbfe;
}

/* 最新动态 */
.recent-updates .update-item {
  padding: 10px 0;
  border-bottom: 1px solid #edf2f7;
  transition: background 0.2s;
}

.recent-updates .update-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.update-date {
  font-size: 12px;
  color: #94a3b8;
  display: block;
  margin-bottom: 4px;
}

.update-text {
  margin: 0;
  font-size: 14px;
  color: #334155;
  line-height: 1.4;
}
</style>
