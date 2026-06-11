<template>
  <div class="auth-layout">
    <div class="left-section">
      <div class="content">
        <h2 class="title">心理AI助手</h2>
        <p class="text">欢迎使用心理AI助手</p>
        <div class="robot">
          <el-image
            style="width: 90px; height: 90px"
            :src="iconUrl"
            alt="心理AI助手"
          ></el-image>
        </div>
      </div>
    </div>
    <div class="right-section">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
const iconUrl = new URL("@/assets/images/logo.png", import.meta.url).href;
</script>
<style lang="scss" scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
  // background-color: #f5f5f5;
  background-image: url("@/assets/images/bg3.jpg");
  background-size: cover;
  background-position: center;
  .left-section {
    width: 50%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.062);
    .content {
      text-align: center;
      color: #fff;
      .title {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }
      .text {
        font-size: 1.2rem;
        margin-bottom: 2rem;
      }
      .robot {
        display: inline-block;
        padding: 1rem;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
      }
    }
  }
  .right-section {
    width: 50%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.377);
  }
}
</style>
