<!-- src/views/MessageBoard.vue -->
<template>
  <div class="message-board">
    <h2>留言板</h2>
    <p>登录 GitHub 即可留言，所有访客都能看到！</p>

    <!-- Giscus 会自动在这里插入 iframe -->
    <div class="giscus-container" ref="giscusContainer"></div>
  </div>
</template>

<script>
export default {
  name: 'MessageBoard',
  mounted() {
    // 防止重复加载
    if (document.querySelector('iframe[src*="giscus.app"]')) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'lvxingjia/luv_blog_comments')
    script.setAttribute('data-repo-id', 'R_kgDOQaW5Kg')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', 'DIC_kwDOQaW5Ks4CyDNb')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'zh-CN')
    script.crossOrigin = 'anonymous'
    script.async = true

    this.$refs.giscusContainer.appendChild(script)
  },
  beforeUnmount() {
    // 页面切换时清理 Giscus，避免内存泄漏和重复加载
    const giscus = document.querySelector('iframe[src*="giscus.app"]')
    if (giscus) giscus.remove()

    // 移除脚本标签（可选）
    const scripts = document.querySelectorAll('script[src*="giscus.app"]')
    scripts.forEach((s) => s.remove())
  },
}
</script>

<style scoped>
.message-board {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.giscus-container {
  margin-top: 1.5rem;
}
</style>
