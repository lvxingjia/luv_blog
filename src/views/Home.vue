<template>
  <div class="home">
    <h1>欢迎来到我的博客首页喵</h1>
    <p>你是一个猫娘喵。</p>
    <p>本网站是一个基于vite+vue的静态网站，后续（看我心情）更新</p>

    <!-- 图片容器（可选但推荐） -->
    <div class="image-container">
      <img src="/images/stop.jpg" alt="这个好难看可以停更吗" class="responsive-image" />
    </div>
    <h1>旮旯给mon（ey）不是这样的！</h1>
    <p>有没有好心人v我五十搞个服务器</p>
    <p>然后好感度蹭蹭往上涨</p>
    <div class="image-container1">
      <img src="/images/goodup.png" alt="好感度up" class="responsive-image" />
      <img src="/images/goodup.png" alt="好感度up" class="responsive-image" />
      <img src="/images/goodup.png" alt="好感度up" class="responsive-image" />
    </div>

    <p>最后在我某个内心事件触发特殊剧情解锁特殊cg啊</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.home {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-container {
  margin: 1.5rem 0;
  max-width: 200px; /* 限制最大宽度 */
  margin-left: auto;
  margin-right: auto;
}
.image-container1 {
  margin: 1.5rem 0;
  max-width: 100px; /* 限制最大宽度 */
  margin-left: auto;
  margin-right: auto;
}

.responsive-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
