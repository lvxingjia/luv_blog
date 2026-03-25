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

    <!-- 文章分类（已注释）
    <div class="nav-section">
      <h3>文章分类</h3>
      <div class="categories">
        <span v-for="category in categories" :key="category" class="category-tag">
          {{ category }}
        </span>
      </div>
    </div>
    -->

    <!-- 最新动态（已注释）
    <div class="nav-section">
      <h3>最新动态</h3>
      <div class="recent-updates">
        <div v-for="update in recentUpdates" :key="update.id" class="update-item">
          <span class="update-date">{{ update.date }}</span>
          <p class="update-text">{{ update.text }}</p>
        </div>
      </div>
    </div>
    -->
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
    // categories 和 recentUpdates 暂时保留 prop 定义，以便将来快速启用
    // categories: {
    //   type: Array,
    //   required: false,
    // },
    // recentUpdates: {
    //   type: Array,
    //   required: false,
    // },
  },
}
</script>

<style scoped>
/* Sidebar 组件自己的样式 */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  padding: 16px 16px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.nav-section {
  margin-bottom: 16px;
}

.nav-section h3 {
  margin: 0 0 12px;
  font-size: 14px;
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
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
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

/* 激活状态 */
:deep(.nav-link.active) {
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white !important;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  transform: translateX(4px);
}

/* 图标微调 */
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

/* 分类标签（已隐藏） */
.categories {
  display: none;
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

/* 最新动态（已隐藏） */
.recent-updates {
  display: none;
}

.recent-updates .update-item {
  padding: 10px 0;
  border-bottom: 1px solid #edf2f7;
  transition: background 0.2s;
}

.recent-updates .update-item:last-child {
  border-bottom: none;
}

.update-date {
  display: block;
  font-size: 12px;
  color: #a0aec0;
  margin-bottom: 4px;
  font-weight: 600;
}

.update-text {
  margin: 0;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
}

.update-item:hover .update-text {
  color: #4f46e5;
}
</style>
