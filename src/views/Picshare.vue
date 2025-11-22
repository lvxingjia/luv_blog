<template>
  <div class="pic_share">
    <h1>分享好康的</h1>

    <div class="image-container">
      <img src="/images/p1.jpg" alt="图片" class="responsive-image" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pic_share',
}
</script>

<style scoped>
.image-container {
  margin: 1.5rem 0;
  max-width: 800px; /* 限制最大宽度 */
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
