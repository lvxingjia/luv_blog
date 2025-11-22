<!-- src/views/ArchiveDetail.vue -->
<template>
  <div class="post-detail" v-if="article">
    <header class="post-header">
      <h1>{{ article.title }}</h1>
      <div class="post-meta">
        {{ article.date }} · {{ article.category }} · {{ article.readTime }}
      </div>
    </header>
    <div class="post-content" v-html="compiledContent"></div>
  </div>
  <div v-else class="not-found">
    <h2>文章未找到</h2>
    <router-link to="/archive">返回归档</router-link>
  </div>
</template>

<script>
import { articles } from '@/data/articles.js'
import { marked } from 'marked'

export default {
  name: 'ArchiveDetail',
  data() {
    return {
      article: null,
    }
  },
  computed: {
    compiledContent() {
      return this.article ? marked.parse(this.article.content || '') : ''
    },
  },
  created() {
    const slug = this.$route.params.slug
    this.article = articles.find((a) => a.slug === slug)
  },
  watch: {
    $route(to) {
      // 支持在详情页之间切换（如从 /post/a 到 /post/b）
      const slug = to.params.slug
      this.article = articles.find((a) => a.slug === slug)
    },
  },
}
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.post-header h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.post-meta {
  color: #999;
  margin-bottom: 2rem;
}
.post-content {
  line-height: 1.7;
  font-size: 1.1rem;
}
.post-content h1,
.post-content h2,
.post-content h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}
.post-content p {
  margin: 1rem 0;
}
.post-content blockquote {
  border-left: 4px solid #667eea;
  padding-left: 1rem;
  color: #555;
  margin: 1.5rem 0;
}
.not-found {
  text-align: center;
  padding: 4rem;
  color: #999;
}
.not-found a {
  color: #667eea;
  text-decoration: none;
}
</style>
