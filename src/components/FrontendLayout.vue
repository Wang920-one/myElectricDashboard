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
                    <h2 style="font-size: 18px; color: var(--text-secondary);">hello~ 欢迎来到我的空间！</h2>
                </div>
                <div class="mode-btns">
                    <div class="nav-container">
                        <div class="nav-item  active" @click="goTo('hero')">首页</div>
                        <div class="nav-item" @click="goTo('project')">项目介绍</div>
                        <!-- <div class="nav-item" @click="goTo('work')">工作经历</div> -->
                        <!-- <div class="nav-item" @click="goTo('skill')">技能列表</div> -->
                        <div class="nav-item" @click="goTo('about')">关于我</div>
                    </div>
                </div>

                <!-- TODO:切换四季背景按钮 -->
                <div class="mode-toggle" @click="toggleDarkMode">
                    {{ isDarkMode ? '☀️' : '🌙' }}
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import SelfIntroduction from './myinfo/SelfIntroduction.vue'
import ProjectIntrodct from './myinfo/ProjectIntrodct.vue'
import MyExperience from './myinfo/MyExperience.vue'
import ParticlesCanvas from './myinfo/ParticlesCanvas.vue'

// 主题
const isDarkMode = ref(false)

// 动画控制
const isLoadShow = ref(false)
const isShow = ref({
    project: false,
    work: false,
    skill: false,
    about: false
})

// 粒子颜色（响应式）
const particleColor = ref('#fff')
const lineColor = ref('rgba(255,255,255,0)')

// 切换暗黑模式
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
}

// 锚点跳转
const goTo = (id) => {
    const el = document.getElementById(id)
    if (el && id === 'hero') {
        // 获取元素到页面顶部的距离
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80 // 80 是导航栏高度
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        })
    } else if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

// 监听暗黑模式 → 改粒子颜色
watch(isDarkMode, (dark) => {
    if (dark) {
        particleColor.value = '#666'
        lineColor.value = 'rgba(100,100,100,0.2)'
    } else {
        particleColor.value = '#fff'
        lineColor.value = 'rgba(255,255,255,0.2)'
    }
})

// 滚动显示模块
const onScroll = () => {
    const check = (id, key) => {
        const el = document.getElementById(id)
        if (!el) return
        const top = el.getBoundingClientRect().top
        if (top < window.innerHeight * 0.75) isShow.value[key] = true
    }
    check('project', 'project')
    check('work', 'work')
    check('skill', 'skill')
    check('about', 'about')
}

onMounted(() => {
    setTimeout(() => {
        isLoadShow.value = true
    }, 100)
    window.addEventListener('scroll', onScroll)

})

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
})
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