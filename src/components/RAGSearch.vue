<template>
  <div class="rag-search-container">
    <!-- 环境检测提示 -->
    <div v-if="isGitHubPages" class="info-banner">
      <span>ℹ️ RAG 搜索功能仅在 Vercel 部署上可用。访问 GitHub Pages 版本查看文章列表。</span>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="query"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="问我关于文章的任何问题..."
        :disabled="loading || isGitHubPages"
        class="search-input"
      />
      <button @click="handleSearch" :disabled="loading || isGitHubPages" class="search-button">
        {{ loading ? '思考中...' : '搜索' }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="skeleton-loader">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line" style="width: 70%"></div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <span>⚠️ {{ error }}</span>
    </div>

    <!-- AI 回答流式输出 -->
    <div v-if="aiResponse" class="ai-response">
      <div class="response-label">🤖 AI 回答:</div>
      <div class="response-text">
        {{ displayedText }}<span v-if="!finished" class="cursor">|</span>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searchResults.length > 0" class="search-results">
      <div class="results-label">📄 相关文章:</div>
      <div v-for="result in searchResults" :key="result.id" class="result-card">
        <h4>{{ result.article_title }}</h4>
        <p class="result-text">{{ result.text.substring(0, 200) }}...</p>
        <router-link :to="`/post/${result.source_url.split('/').pop()}`" class="read-more">
          查看完整文章 →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const query = ref('')
const loading = ref(false)
const aiResponse = ref('')
const searchResults = ref([])
const displayedText = ref('')
const finished = ref(false)
const error = ref('')
const isGitHubPages = ref(false)

// 检测是否在 GitHub Pages 上
onMounted(() => {
  if (typeof window !== 'undefined') {
    isGitHubPages.value = window.location.hostname === 'lvxingjia.github.io'
  }
})

// API 基础 URL
// 优先级: 环境变量 > 当前域名 > 默认本地
const getAPIBase = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  // 在浏览器中，使用当前站点域名
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:3000'
}

const API_BASE = getAPIBase()

const handleSearch = async () => {
  if (isGitHubPages.value) {
    error.value = 'RAG 搜索仅在 Vercel 部署上可用。请访问 Vercel 部署版本。'
    return
  }

  if (!query.value.trim()) {
    error.value = '请输入查询问题'
    return
  }

  loading.value = true
  aiResponse.value = ''
  displayedText.value = ''
  searchResults.value = []
  finished.value = false
  error.value = ''

  try {
    console.log('[RAGSearch] 发送查询:', query.value)

    const response = await fetch(`${API_BASE}/api/rag/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.value,
        topK: 5,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    console.log('[RAGSearch] 开始流式接收响应')

    // 流式处理响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) {
        finished.value = true
        console.log('[RAGSearch] 响应完成')
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')

      // 保留最后一行（可能不完整）
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(5))

            if (data.error) {
              console.error('[RAGSearch] 服务器错误:', data.error)
              error.value = data.error
            } else if (data.done) {
              finished.value = true
            } else if (data.content) {
              aiResponse.value += data.content
              displayedText.value = aiResponse.value
              console.log('[RAGSearch] 收到内容块:', data.content.substring(0, 20))
            }
          } catch (e) {
            // 忽略 JSON 解析错误
            console.debug('[RAGSearch] 忽略非 JSON 行:', line.substring(0, 30))
          }
        }
      }
    }
  } catch (err) {
    console.error('[RAGSearch] 搜索错误:', err)
    error.value = err.message || '查询失败，请稍后再试'
    finished.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.rag-search-container {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.search-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.search-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4338ca, #4f46e5);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transform: translateY(-2px);
}

.search-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.info-banner {
  background: #dbeafe;
  color: #075985;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border-left: 4px solid #0284c7;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  line-height: 1.4;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #dc2626;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skeleton-loader {
  animation: pulse 2s infinite;
  margin-bottom: 1.5rem;
}

.skeleton-line {
  height: 14px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-line:last-child {
  margin-bottom: 0;
}

.ai-response {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #4f46e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.response-label {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
  font-size: 0.95rem;
}

.response-text {
  line-height: 1.8;
  color: #374151;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 0.95rem;
}

.cursor {
  animation: blink 0.7s infinite;
  display: inline-block;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.search-results {
  margin-top: 1.5rem;
}

.results-label {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.result-card {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #10b981;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.result-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-card h4 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.result-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.read-more {
  display: inline-block;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.read-more:hover {
  color: #4338ca;
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
  }

  .rag-search-container {
    padding: 1rem;
  }

  .ai-response {
    padding: 1rem;
  }

  .result-card {
    padding: 1rem;
  }
}
</style>
