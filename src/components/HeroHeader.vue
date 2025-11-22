<template>
  <header
    class="main-header"
    :class="{
      'main-header--hero': showHero,
      'main-header--shrunk': props.isHero && !showHero,
    }"
    :style="{ height: currentHeight + 'px' }"
  >
    <!-- 背景图始终渲染 -->
    <div class="hero-bg" style="background-image: url('/luv_blog/images/header_bg.jpg')"></div>

    <!-- 遮罩层：根据状态调整透明度 -->
    <div class="hero-overlay" :class="{ 'hero-overlay--shrunk': !showHero && props.isHero }"></div>

    <div class="header-content">
      <div v-if="showHero" class="hero-full">
        <h1 class="hero-title">{{ heroTitle }}</h1>
        <p class="hero-subtitle">{{ heroSubtitle }}</p>
      </div>
      <div v-else class="normal-brand">
        <h2 class="normal-title">{{ normalTitle }}</h2>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  normalTitle: String,
  isHero: Boolean,
  heroTitle: String,
  heroSubtitle: String,
  // heroBg: String, // 不再需要传入背景图路径
})

const scrollY = ref(0)
const hasExitedHero = ref(false)

const handleScroll = () => {
  scrollY.value = window.scrollY
  if (!hasExitedHero.value && scrollY.value > 50) {
    hasExitedHero.value = true
  }
}

onMounted(() => {
  if (props.isHero) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const showHero = computed(() => props.isHero && !hasExitedHero.value)
const currentHeight = computed(() => {
  if (!props.isHero) return 80
  return showHero.value ? window.innerHeight : 80
})
</script>

<style scoped>
.main-header {
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: height 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  transition: transform 0.6s ease-in-out;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 全屏遮罩 */
  transition: background 0.6s ease-in-out;
  z-index: 1; /* 确保遮罩层在内容之下 */
}

.hero-overlay--shrunk {
  background: rgba(255, 255, 255, 0.6); /* 小 header 白色半透明 */
}

.header-content {
  position: relative;
  z-index: 2; /* 确保内容在遮罩层之上 */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  color: #fff; /* 确保文字颜色对比度足够 */
}

/* 标题样式 */
.hero-title {
  font-size: 3rem;
  font-weight: 300;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-top: 1rem;
  opacity: 0.9;
}

.normal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #2c3e50; /* 或 white，根据你的图片决定 */
}

/* 小 Header 样式：毛玻璃 + 固定布局 */
.main-header--shrunk {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0 40px;
  justify-content: flex-start;
  color: #333;
  text-align: left;
}
</style>
