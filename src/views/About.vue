<!-- src/views/About.vue -->
<template>
  <div class="about">
    <h1>关于我</h1>
    <p>你好，我是Luv，一个ACGN爱好者。</p>
    <p>vue初学者自己搭建的小站</p>
    <p>网站很简陋不要嘲笑我</p>
    <div class="image-container">
      <img src="/images/manbo.png" alt="小马" class="responsive-image" />
    </div>

    <p>原神60级</p>
    <p>崩铁70级</p>
    <p>鸣潮80级</p>
    <p>csgo400小时</p>
    <p>何意味</p>
    <p>大东北，是我的家乡</p>
  </div>
</template>

<script>
export default {
  name: 'About',
}
</script>

<style scoped>
.about {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shleadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.image-container {
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
