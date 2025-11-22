<template>
  <div class="anime">
    <h1>动漫</h1>

    <div class="image-container">
      <img src="/images/a1.png" alt="好感度up" class="responsive-image" />
    </div>
    <p>《17-26》</p>
    <p>藤本树稳定发挥，让我笑得很开心,豪看</p>
  </div>
</template>

<script>
export default {
  name: 'Anime',
}
</script>

<style scoped>
.image-container {
  margin: 1.5rem 0;
  max-width: 400px; /* 限制最大宽度 */
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
