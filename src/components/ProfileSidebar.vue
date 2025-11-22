<!-- src/components/ProfileSidebar.vue -->
<template>
  <aside class="profile-sidebar">
    <!-- 个人资料卡片 -->
    <div class="profile-card">
      <div class="avatar-container">
        <img src="/images/head.png" alt="头像" class="avatar" />
      </div>
      <h2 class="profile-name">{{ profile.name }}</h2>
      <p class="profile-bio">{{ profile.bio }}</p>

      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-number">{{ profile.stats.articles }}</span>
          <span class="stat-label">文章</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ profile.stats.categories }}</span>
          <span class="stat-label">分类</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ profile.stats.words }}</span>
          <span class="stat-label">字数</span>
        </div>
      </div>

      <div class="social-links">
        <a
          v-for="social in profile.socialLinks"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
        >
          <i :class="social.icon"></i>
        </a>
      </div>

      <div class="contact-info">
        <h4>联系我</h4>
        <p><i class="fas fa-envelope"></i> {{ profile.contact.email }}</p>
        <p><i class="fas fa-map-marker-alt"></i> {{ profile.contact.location }}</p>
      </div>
    </div>

    <!-- 标签云 -->
    <div class="tags-cloud">
      <h3>标签云</h3>
      <div class="tags">
        <span
          v-for="tag in tags"
          :key="tag"
          class="tag"
          :style="{ fontSize: getTagSize(tag) }"
          @click="$emit('tag-click', tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'ProfileSidebar',
  props: {
    profile: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  methods: {
    getTagSize(tag) {
      const sizes = ['12px', '14px', '16px', '18px', '20px']
      return sizes[tag.length % sizes.length]
    },
  },
}
</script>

<style scoped>
/* 注意：这些样式原本在 App.vue 中，现在移到组件内 */
.profile-sidebar {
  width: 400px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-container {
  margin-bottom: 1.5rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 4px solid #667eea;
  color: #6c757d;
  font-size: 2.5rem;
}

.profile-name {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.profile-bio {
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 50%;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-3px);
}

.contact-info {
  text-align: left;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.contact-info h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.contact-info p {
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.contact-info i {
  width: 20px;
  margin-right: 0.5rem;
  color: #667eea;
}

.tags-cloud {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.tags-cloud h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f8f9fa;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}
</style>
