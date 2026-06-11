<template>
  <div class="index-bg">
    <el-container class="container-home-app">
      <el-header class="header-container">
        <div class="header-inner">
          <div class="logo">
            <i class="el-icon-house el-icon--left text-primary-green"></i>
            <span class="logo-text">个人空间</span>
          </div>

          <!-- Element UI 导航菜单 -->
          <el-menu
            class="nav-menu"
            mode="horizontal"
          >
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">个人履历</el-menu-item>
            <el-menu-item index="3">作品展示</el-menu-item>
          </el-menu>

          <!-- Element UI 按钮 -->
          <el-button
            type="primary"
            class="consult-btn"
            :style="{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }"
          >
            注册
          </el-button>
        </div>
      </el-header>
      <el-main class="main-container">
        <!-- 背景图片层 -->
        <div
          class="bg-layer"
        ></div>

        <!-- 内容层 -->
        <div class="content-layer">
          <div class="content-inner">
            <h1 class="main-title">
              你好~ 欢迎来到 ContainerHome
            </h1>
            <p class="sub-title">这是我的世界</p>

            <el-button
              type="primary"
              class="catalog-btn"
              :style="{
                backgroundColor: '#4CAF50',
                borderColor: '#4CAF50',
                borderRadius: '2rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
              }"
            >
              展示
            </el-button>
          </div>

          <!-- 底部卡片组（毛玻璃效果） -->
          <div class="cards-container">
            <!-- 卡片1：毛玻璃 -->
            <div class="card card-glass">
              <div class="card-header">
                <h3>Дизайн проект</h3>
                <i class="el-icon-check text-primary-green"></i>
              </div>
              <p class="card-desc">Индивидуальный дизайн проект вашего дома</p>
            </div>

            <!-- 卡片2：绿色 -->
            <div class="card card-green">
              <div class="card-header">
                <h3>Бесплатная доставка</h3>
                <i class="el-icon-truck text-white"></i>
              </div>
              <p class="card-desc">
                Бесплатная доставка по всей территории России
              </p>
            </div>

            <!-- 卡片3：棕色 -->
            <div class="card card-brown">
              <div class="card-header">
                <h3>Сборка под ключ</h3>
                <i class="el-icon-s-tools text-white"></i>
              </div>
              <p class="card-desc">
                Полная установка и подключение всех систем
              </p>
            </div>
          </div>
        </div>

        <!-- 折扣徽章 -->
        <!-- <div class="discount-badge">
          <div class="badge-circle">
            <div class="badge-text">
              <div class="discount-percent">5%</div>
              <div class="discount-label">СКИДКА</div>
            </div>
          </div>
          <div class="badge-tip">При заказе в апреле</div>
        </div> -->
      </el-main>
      <!-- <el-footer class="footer-container">
        <div class="footer-inner">
          <div class="copyright">© 2025 ContainerHome. Все права защищены</div>
          <div class="social-links">
            <a href="#" class="social-link"><i class="el-icon-facebook"></i></a>
            <a href="#" class="social-link"
              ><i class="el-icon-instagram"></i
            ></a>
            <a href="#" class="social-link"><i class="el-icon-vk"></i></a>
          </div>
        </div>
      </el-footer> -->
    </el-container>
  </div>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>
/* 全局基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', system-ui, sans-serif;
}
.bg-layer{
    background-image: url("@/assets/images/bg1.jpg");
}
/* 头部导航 */
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.274);
//   padding: 0.75rem 0;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.logo .el-icon {
  margin-right: 0.5rem;
  color: var(--primary-green);
}

.logo-text {
  font-size: 1rem;
}

/* Element UI 导航菜单样式覆盖 */
.nav-menu {
  background-color: transparent;
  border-bottom: none;
}

.nav-menu .el-menu-item {
  color: var(--white);
  font-size: 0.9rem;
  margin: 0 0.5rem;
}

.nav-menu .el-menu-item:hover {
  color: var(--primary-green);
}

.consult-btn {
  font-size: 0.875rem;
  padding: 0.25rem 1rem;
  border-radius: 2rem;
}

/* 主体内容 */
.main-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

/* 背景层 */
.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.9);
}

/* 内容层 */
.content-layer {
  position: relative;
  height: 100%;
  padding: 5rem 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

@media (min-width: 768px) {
  .main-title {
    font-size: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .main-title {
    font-size: 4rem;
  }
}

.sub-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.catalog-btn {
  font-weight: 500;
}

/* 卡片容器 */
.cards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: auto;
}

@media (min-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* 卡片通用样式 */
.card {
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 500;
}

.card-desc {
  font-size: 0.875rem;
  line-height: 1.4;
}

/* 毛玻璃卡片 */
.card-glass {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-glass .card-desc {
  color: var(--gray-300);
}

/* 绿色卡片 */
.card-green {
  background-color: rgba(76, 175, 80, 0.9);
}

.card-green:hover {
  background-color: var(--primary-green);
}

/* 棕色卡片 */
.card-brown {
  background-color: rgba(141, 110, 99, 0.9);
}

.card-brown:hover {
  background-color: var(--accent-brown);
}

/* 折扣徽章 */
.discount-badge {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
}

@media (min-width: 768px) {
  .discount-badge {
    right: 2.5rem;
  }
}

.badge-circle {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background-color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.discount-percent {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-brown);
}

.discount-label {
  font-size: 0.75rem;
  color: var(--dark);
}

.badge-tip {
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--dark);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
}

/* 页脚 */
.footer-container {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem 0;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 768px) {
  .footer-inner {
    flex-direction: row;
    gap: 0;
  }
}

.copyright {
  font-size: 0.875rem;
  color: var(--gray-400);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: var(--gray-400);
  font-size: 1rem;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--white);
}
</style>