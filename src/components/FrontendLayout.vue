<template>
  <div class="color-bg">
    <!-- TODO:四季粒子效果实现 -->
    <!-- <canvas ref="canvasRef" class="particles-canvas"></canvas> -->
    <ParticlesCanvas :particleColor="particleColor" :lineColor="lineColor" />

    <!-- 导航定位栏 -->
    <el-affix target=".color-bg" :offset="0">
      <div class="up-btns">
        <!-- 欢迎语 -->
        <div class="mode-hello">
          <h2 style="font-size: 18px; color: var(--text-secondary)">
            hello~ 欢迎来到我的空间！
          </h2>
        </div>
        <div class="mode-btns">
          <div class="nav-container nav-desktop">
            <div
              v-for="item in navLinks"
              :key="item.id"
              class="nav-item"
              :class="{ active: activeNav === item.id }"
              @click="goTo(item.id)"
            >
              {{ item.label }}
            </div>
          </div>
          <el-dropdown
            class="nav-mobile"
            trigger="click"
            placement="bottom-end"
            :popper-class="isDarkMode ? 'nav-mobile-dropdown is-dark' : 'nav-mobile-dropdown'"
            :popper-options="{ modifiers: [{ name: 'offset', options: { offset: [0, 10] } }] }"
            @command="handleMobileCommand"
          >
            <span class="nav-dropdown-trigger">
              <el-icon :size="22"><Menu /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in navLinks"
                  :key="item.id"
                  :command="item.id"
                  :class="{ 'is-active': activeNav === item.id }"
                >
                  {{ item.label }}
                </el-dropdown-item>
                <el-dropdown-item divided command="toggle-theme">
                  {{ isDarkMode ? "☀️ 浅色模式" : "🌙 深色模式" }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 桌面端主题切换 -->
        <div class="mode-toggle mode-toggle-desktop" @click="toggleDarkMode">
          {{ isDarkMode ? "☀️" : "🌙" }}
        </div>
      </div>
    </el-affix>

    <!-- 首页第一屏 -->
    <div id="hero" class="hero-section" :class="{ dark: isDarkMode }">
      <SelfIntroduction :class="{ show: isLoadShow }" />
    </div>

    <!-- 项目介绍 -->
    <div id="project" class="section-wrap" :class="{ dark: isDarkMode }">
      <ProjectIntrodct :class="{ show: isShow.project }" />
    </div>

    <!-- 关于我 -->
    <div id="about" class="section-wrap" :class="{ dark: isDarkMode }">
      <MyExperience :class="{ show: isShow.about }" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import SelfIntroduction from "./myinfo/SelfIntroduction.vue";
import ProjectIntrodct from "./myinfo/ProjectIntrodct.vue";
import MyExperience from "./myinfo/MyExperience.vue";
import ParticlesCanvas from "./myinfo/ParticlesCanvas.vue";

// 导航项
const navLinks = [
  { id: "hero", label: "首页" },
  { id: "project", label: "项目介绍" },
  { id: "about", label: "关于我" },
];

const activeNav = ref("hero");

// 主题
const isDarkMode = ref(false);

// 动画控制
const isLoadShow = ref(false);
const isShow = ref({
  project: false,
  work: false,
  skill: false,
  about: false,
});

// 粒子颜色（响应式）
const particleColor = ref("#fff");
const lineColor = ref("rgba(255,255,255,0)");

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

// 移动端下拉菜单
const handleMobileCommand = (command) => {
  if (command === "toggle-theme") {
    toggleDarkMode();
    return;
  }
  goTo(command);
};

// 锚点跳转
const goTo = (id) => {
  activeNav.value = id;
  const el = document.getElementById(id);
  if (el && id === "hero") {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({
      top: top,
      behavior: "smooth",
    });
  } else if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

// 滚动时同步当前导航
const syncActiveNav = () => {
  const scrollPos = window.scrollY + 100;
  for (let i = navLinks.length - 1; i >= 0; i--) {
    const el = document.getElementById(navLinks[i].id);
    if (el && el.offsetTop <= scrollPos) {
      activeNav.value = navLinks[i].id;
      break;
    }
  }
};

// 监听暗黑模式 → 改粒子颜色
watch(isDarkMode, (dark) => {
  if (dark) {
    particleColor.value = "#666";
    lineColor.value = "rgba(100,100,100,0.2)";
  } else {
    particleColor.value = "#fff";
    lineColor.value = "rgba(255,255,255,0.2)";
  }
});

// 滚动显示模块
const onScroll = () => {
  syncActiveNav();

  const check = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.75) isShow.value[key] = true;
  };
  check("project", "project");
  check("work", "work");
  check("skill", "skill");
  check("about", "about");
};

onMounted(() => {
  setTimeout(() => {
    isLoadShow.value = true;
  }, 100);
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  transition: all 0.5s ease;
}

.color-bg {
  background-image: url("@/assets/images/bg3.jpg");
  background-size: cover;
  background-position: center;
}

.up-btns {
  height: 80px;
  background-color: #ffffff4d;
  /* padding: 1.5rem 0; */
  /* margin: 0 30px; */
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);

  .mode-hello {
    position: fixed;
    top: 30px;
    left: 30px;
    z-index: 999;
    font-size: 0.95rem;
    color: #64748b;
    font-weight: 500;
  }

  .mode-btns {
    position: fixed;
    z-index: 999;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 20px;
    font-size: 16px;
    color: var(--text-secondary);
    cursor: pointer;

    .nav-item {
      text-decoration: none;
      color: #64748b;
      margin-left: 2rem;
      font-size: 0.95rem;
      transition: color 0.3s;
    }

    .nav-item:hover,
    .active {
      color: #4f46e5;
      font-weight: 600;
    }

    .nav-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      gap: 30px;
    }

    .nav-mobile {
      display: none;
    }

    .nav-dropdown-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: #64748b;
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
  }

  /* 明暗切换 */
  .mode-toggle {
    position: fixed;
    top: 25px;
    right: 30px;
    z-index: 999;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background: var(--card-bg);
    backdrop-filter: blur(8px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
}

.hero-section,
.about-section {
  --text-primary: #2c3333;
  --text-secondary: #5a6363;
  --border-color: rgba(44, 51, 51, 0.1);
  --card-bg: rgba(255, 255, 255, 0.4);
}

.hero-section.dark,
.about-section.dark {
  --text-primary: #f0f2f2;
  --text-secondary: #b8c0c0;
  --border-color: rgba(240, 242, 242, 0.1);
  --card-bg: rgba(36, 41, 41, 0.4);
}

/* 主题 */
.hero-section,
.section-wrap {
  /* background: #f8f7f2; */
  --text: #2c3333;
  --card: rgba(255, 255, 255, 0.4);
  --border: rgba(0, 0, 0, 0.08);
}

.hero-section.dark,
.section-wrap.dark {
  --text: #eee;
  --card: rgba(30, 30, 45, 0.4);
  --border: rgba(255, 255, 255, 0.08);
}

.hero-section {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

@media (max-width: 968px) {
  .up-btns .mode-hello {
    left: 12px;
    top: 28px;
  }

  .up-btns .mode-hello h2 {
    font-size: 14px;
    max-width: calc(100vw - 80px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .up-btns .mode-btns {
    top: 22px;
    right: 18px;
    left: auto;
    transform: none;
  }

  .up-btns .mode-btns .nav-desktop {
    display: none;
  }

  .up-btns .mode-btns .nav-mobile {
    display: inline-flex;
  }

  .up-btns .mode-toggle-desktop {
    display: none;
  }

  .hero-section {
    height: auto;
    min-height: 100vh;
    align-items: flex-start;
    padding: 20px 12px 32px;
  }
}

:deep(.el-dropdown-menu__item.is-active) {
  color: #4f46e5;
  font-weight: 600;
  background-color: rgba(79, 70, 229, 0.08);
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* 内容区块 */
.section-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  position: relative;
  z-index: 2;
}
</style>

<style>
/* 下拉菜单 teleport 到 body，需非 scoped 样式 */
.nav-mobile-dropdown.el-popper {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  margin-right: 6px;
}

.nav-mobile-dropdown .el-dropdown-menu {
  background: rgba(255, 255, 255, 0.52);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  padding: 6px;
  min-width: 148px;
}

.nav-mobile-dropdown .el-dropdown-menu__item {
  border-radius: 8px;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.5;
  padding: 10px 14px;
}

.nav-mobile-dropdown .el-dropdown-menu__item:not(.is-disabled):hover,
.nav-mobile-dropdown .el-dropdown-menu__item:not(.is-disabled):focus {
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.nav-mobile-dropdown .el-dropdown-menu__item.is-active {
  color: #4f46e5;
  font-weight: 600;
  background: rgba(79, 70, 229, 0.12);
}

.nav-mobile-dropdown .el-dropdown-menu__item--divided {
  border-top-color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
}

.nav-mobile-dropdown.is-dark .el-dropdown-menu {
  background: rgba(36, 41, 41, 0.62);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.nav-mobile-dropdown.is-dark .el-dropdown-menu__item {
  color: #cbd5e1;
}

.nav-mobile-dropdown.is-dark .el-dropdown-menu__item:not(.is-disabled):hover,
.nav-mobile-dropdown.is-dark .el-dropdown-menu__item:not(.is-disabled):focus {
  background: rgba(99, 102, 241, 0.18);
  color: #a5b4fc;
}

.nav-mobile-dropdown.is-dark .el-dropdown-menu__item.is-active {
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.2);
}

.nav-mobile-dropdown.is-dark .el-dropdown-menu__item--divided {
  border-top-color: rgba(255, 255, 255, 0.1);
}
</style>