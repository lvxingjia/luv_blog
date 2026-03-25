<!-- src/views/Archive.vue -->

<template>
  <div class="archive-page">
    <h2>文章归档</h2>

    <!-- 遍历排序后的年份数组 -->
    <div v-for="year in sortedYears" :key="year" class="year-section">
      <h3>{{ year }} 年</h3>
      <ul class="article-list">
        <li v-for="article in groupedArticles[year]" :key="article.id" class="article-item">
          <router-link :to="`/post/${article.slug}`" class="article-title">
            {{ article.title }}
          </router-link>
          <span class="article-meta">
            {{ article.date }} · {{ article.category }} · {{ article.readTime }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { articles } from '../../data/articles'

export default {
  name: 'Archive',
  data() {
    return {
      articles: articles.sort((a, b) => new Date(b.date) - new Date(a.date)), // 按时间倒序（最新在前）
    }
  },
  computed: {
    groupedArticles() {
      // 按年份分组
      const groups = this.articles.reduce((acc, article) => {
        const year = article.date.split('-')[0]
        if (!acc[year]) acc[year] = []
        acc[year].push(article)
        return acc
      }, {})

      // 对每年的文章按日期倒序排序（同一年内最新在前）
      Object.keys(groups).forEach((year) => {
        groups[year].sort((a, b) => new Date(b.date) - new Date(a.date))
      })

      return groups
    },

    // 年份倒序（最新年份在前）
    sortedYears() {
      return Object.keys(this.groupedArticles).sort((a, b) => b - a)
    },
  },
}
</script>

<style scoped>
.archive-page {
  padding: 20px;
}

.year-section h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.4rem;
}

.article-list {
  list-style: none;
  padding: 0;
}

.article-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.article-title {
  font-size: 1.1rem;
  color: #333;
  text-decoration: none;
  font-weight: 600;
}

.article-title:hover {
  color: #667eea;
}

.article-meta {
  font-size: 0.9rem;
  color: #777;
  display: block;
  margin-top: 4px;
}
</style>
