<template>
    <div class="content-layout">
        <div class="hero-content">
            <div class="hero-info">
                <div class="profile-info">
                    <div class="avatar-wrapper">
                        <img :src="iconUrl" alt="个人头像" class="my-avatar" />
                    </div>
                    <h1 class="user-name">王玉针</h1>
                    <p class="user-meta">4年经验 | 27岁 | 本科</p>
                    <p class="job-intent">🎯 意向岗位：Web 前端 / 数据可视化</p>
                    <div class="status-badge">✅ 到岗状态：随时到岗</div>
                    <button class="resume-btn">个人简历 ⬇️</button>
                </div>

                <hr class="divider" />

                <!-- <el-divider class="hero-skill-divider"> 个人技能 </el-divider> -->

                <div class="skills-section">
                    <div v-for="(group, index) in skillList" :key="index" class="skill-group">
                        <h3 class="skill-title">{{ group.title }}</h3>
                        <div class="tag-container">
                            <span v-for="tag in group.tags" :key="tag" class="skill-tag">
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                    <div class="skill-group">
                        <h3 class="skill-title"> 🎯 AI网站项目</h3>
                        <div class="tag-container">
                            <span class="skill-tag" @click="router.push('/auth/login')"> 点击查看详情</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="typewriter-box">
                <div class="content-card content-card-advantage">
                    <h2 class="section-main-title">🌟 个人优势</h2>
                    <ul class="advantage-list">
                        <li><strong>3年工业数字化前端深耕：</strong> 具备独立负责大型项目全流程开发能力，注重交付质量。</li>
                        <li><strong>前沿可视化/3D扎实：</strong> 精通 ECharts、DataV，熟练掌握 Three.js 数字孪生厂区交互与坐标转换。</li>
                        <li><strong>跨端与硬件交互：</strong> 熟练运用 UniApp 进行多端开发，具备 NFC、语音播报等工业级硬件对接经验。</li>
                        <li><strong>极强自驱与无断层自学：</strong> 离职期间高标准自学 Vue3+TS+Vite 生态，并有完整大屏 Demo 产出。</li>
                        <li><strong>团队赋能：</strong> 具备良好的代码规范意识，善于封装高复用业务组件，提升团队迭代效率。</li>
                    </ul>
                </div>
                <div class="content-card content-card-experience">
                    <h2 class="section-main-title">💼 工作经历</h2>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-header">
                                <span class="time-range">2021.07 - 2024.10</span>
                                <span class="company">珠海优特电力科技股份有限公司</span>
                                <span class="role">PC 软件工程师（前端方向）</span>
                            </div>
                            <div class="timeline-body">
                                <p class="project-name"><strong>核心项目：</strong>安全管控一体化平台 (Web端 / 移动端 / UniApp)</p>
                                <p class="project-desc">
                                    <strong>项目简介：</strong>面向电力及工业场景，集成智能巡检、电子工作票、智能锁控、安防监控为一体的综合数字化安全管理系统。
                                </p>
                                <ul class="achievement-list">
                                    <li><strong>架构与性能优化：</strong>主导前端核心架构搭建与选型（Vue2/3+ElementUI），针对大体量场景引入组件懒加载、Web
                                        Worker多线程计算等方案，大幅提升首屏加载速度。</li>
                                    <li><strong>3D数字孪生：</strong>利用 <strong>Three.js</strong> 深度定制 3D
                                        智慧厂区，通过低多边形优化与纹理压缩攻克大模型卡顿难题，实现动态模型精准定位与坐标高效转换。</li>
                                    <li><strong>数据可视化：</strong>独立负责大屏模块，基于 ECharts/DataV
                                        深度定制多类动态图表，设计本地数据缓存与增量更新机制，解决高频刷新下的卡顿。</li>
                                    <li><strong>移动端与硬件交互：</strong>基于 UniApp 独立研发外勤 App，深度对接硬件层，集成 NFC
                                        标签识别、离线语音播报等特种作业功能。</li>
                                </ul>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-header">
                                <span class="time-range">2025.06 - 2025.11</span>
                                <span class="company">澳门江门同乡会</span>
                                <span class="role">新媒体运营（兼职/视觉赋能）</span>
                            </div>
                            <div class="timeline-body">
                                <p class="project-desc">负责数字化活动视觉策划、短视频剪辑及公众号矩阵宣发。保持良好职场节奏，跨界锻炼了优秀的视觉审美与排版布局能力，并成功反哺到前端
                                    UI/UX 的细节把控中。</p>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-header">
                                <span class="time-range">2025.10 - 至今</span>
                                <span class="company">🛠️ 独立项目与技术进阶展示</span>
                                <span class="role">前沿技术深耕</span>
                            </div>
                            <div class="timeline-body">
                                <p class="project-desc">全面采用 <strong>Vue3 Composition API + TypeScript + Vite +
                                        Pinia</strong> 重构并独立设计了一套全新的电力可视化全景看板系统，确保自身技术栈与一线无缝衔接。无技术断层，具备即战力。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


const iconUrl = new URL("@/assets/images/avatar.jpg", import.meta.url).href;

const skillList = ref([
    {
        title: "🌐 前端开发",
        tags: ["Vue2", "Vue3", "JavaScript", "ElementUI", "HTML5", "TypeScript"]
    },
    {
        title: "📊 可视化 / 3D",
        tags: ["ECharts", "DataV", "shturl.c"]
    },
    {
        title: "📱 跨端开发",
        tags: ["UniApp", "React Native(app端)", "Java"]
    },
    {
        title: "🎬 多媒体创作",
        tags: ["剪映", "无人机", "PR", "PS", "相机"]
    }
])

// 打字机
const typeTextShow = ref('')
const typeText = ' 拥有 3 年企业级前端开发经验,深耕 ToB 工业数字化领域，擅长前端页面开发、数据可视化、3D 交互场景搭建与跨端应用开发。\n 日常热爱视觉创作、视频拍摄剪辑与内容创作，兼具技术实力与审美能力，做事踏实细心，学习能力强，乐于持续深耕技术，追求高效优质的开发体验，期待与更多行业伙伴交流成长。'
let charIndex = 0


// 打字机
const typeWriter = () => {
    if (charIndex < typeText.length) {
        typeTextShow.value += typeText.charAt(charIndex)
        charIndex++
        setTimeout(typeWriter, 60)
    }
}

onMounted(() => {
    setTimeout(() => {
        typeWriter()
    }, 100)
})
</script>

<style lang="scss" scoped>
.content-layout {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
}

.hero-content {
    padding: 35px;
    width: 95%;
    max-width: 1440px;
    display: flex;
    height: 95%;
    gap: 0;

    .hero-info {
        overflow-y: auto;
        width: 28%;
        height: 95%;
        max-width: 500px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.7);
        border-radius: 16px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
        background: rgba(255, 255, 255, 0.123);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.7);
        border-radius: 16px;
        padding: 2rem 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar-wrapper {
            width: 110px;
            height: 110px;
            margin: 0 auto 1.2rem auto;
            border-radius: 50%;
            padding: 4px;
            background: linear-gradient(135deg, #a5b4fc, #e0e7ff);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
        }

        .my-avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .user-name {
            font-size: 1.6rem;
            color: #1e293b;
            margin-bottom: 0.5rem;
            letter-spacing: 2px;
        }

        .user-meta {
            font-size: 0.85rem;
            color: #64748b;
            margin-bottom: 1rem;
        }

        .job-intent {
            font-size: 0.88rem;
            color: #475569;
            background: rgba(239, 246, 255, 0.6);
            padding: 0.4rem;
            border-radius: 6px;
            margin-bottom: 0.6rem;
        }

        .status-badge {
            display: inline-block;
            font-size: 0.8rem;
            color: #16a34a;
            background: rgba(240, 253, 250, 0.8);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-weight: 500;
        }

        .resume-btn {
            width: 100%;
            margin-top: 1.2rem;
            padding: 0.6rem;
            border: none;
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            color: white;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .resume-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
        }

        .divider {
            border: 0;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.06), transparent);
            margin: 1.5rem 0;
        }


        /* 技能标签交互设计 */
        .skill-group {
            text-align: left;
            margin-bottom: 1.2rem;
        }

        .skill-title {
            font-size: 0.88rem;
            color: #475569;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .tag-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
        }

        .skill-tag {
            font-size: 0.78rem;
            background: rgba(255, 255, 255, 0.8);
            color: #475569;
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
            border: 1px solid rgba(226, 232, 240, 0.8);
            transition: all 0.25s ease;
            cursor: default;
        }

        .skill-tag:hover {
            background: #4f46e5;
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(79, 70, 229, 0.15);
            border-color: #4f46e5;

        }
    }

    .hero-info::-webkit-scrollbar {
        width: 5px;
    }

    .hero-info::-webkit-scrollbar-track {
        background: #ffffff85;
    }

    .hero-info::-webkit-scrollbar-thumb {
        background: #818181a8;
        border-radius: 5px;
    }

    .typewriter-box {
        padding: 0 2rem;
        flex: 1;
        min-width: 0;
        height: 95%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: left;
        justify-content: space-between;
        gap: 20px;

        .content-card {
            width: 100%;
            min-height: 0;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.7);
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
            background: rgba(255, 255, 255, 0.185);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.7);
            border-radius: 16px;
            padding: 2rem;
            overflow-y: auto;
        }

        .content-card-advantage {
            flex: 0 0 30%;
        }

        .content-card-experience {
            flex: 1;
        }

        .content-card::-webkit-scrollbar {
            width: 5px;
        }

        .content-card::-webkit-scrollbar-track {
            background: #ffffff85;
        }

        .content-card::-webkit-scrollbar-thumb {
            background: #818181a8;
            border-radius: 5px;
        }

        .section-main-title {
            font-size: 1.2rem;
            color: #1e293b;
            margin-bottom: 1.2rem;
            position: relative;
            padding-bottom: 0.4rem;
        }

        .section-main-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 35px;
            height: 3px;
            background: #4f46e5;
            border-radius: 2px;
        }

        /* 个人优势列表 */
        .advantage-list {
            padding-left: 1.2rem;
        }

        .advantage-list li {
            font-size: 0.92rem;
            line-height: 1.7;
            color: #475569;
            margin-bottom: 0.6rem;
        }

        /* ==========================================================================
   6. 高级工作经历时间线 (Timeline)
   ========================================================================== */
        .timeline {
            position: relative;
            padding-left: 1.5rem;
            border-left: 2px solid rgba(203, 213, 225, 0.6);
        }

        .timeline-item {
            position: relative;
            margin-bottom: 2rem;
        }

        .timeline-item:last-child {
            margin-bottom: 0;
        }

        .timeline-dot {
            position: absolute;
            left: calc(-1.5rem - 6px);
            top: 4px;
            width: 10px;
            height: 10px;
            background: #4f46e5;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }

        .timeline-header {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.8rem;
        }

        .time-range {
            font-size: 0.85rem;
            font-weight: 600;
            background: rgba(79, 70, 229, 0.08);
            color: #4f46e5;
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
        }

        .company {
            font-size: 0.98rem;
            font-weight: 700;
            color: #1e293b;
        }

        .role {
            font-size: 0.88rem;
            color: #64748b;
            font-weight: 500;
        }

        .timeline-body {
            font-size: 0.9rem;
            line-height: 1.6;
            color: #475569;
        }

        .project-name,
        .project-desc {
            margin-bottom: 0.4rem;
        }

        .achievement-list {
            padding-left: 1.2rem;
            margin-top: 0.5rem;
        }

        .achievement-list li {
            margin-bottom: 0.4rem;
            color: #576574;
        }

    }


}

.hero-content.show {
    opacity: 1;
    transform: translateY(0);
}

/* ==========================================================================
   响应式布局 — 平板 / 手机多端适配
   ========================================================================== */

/* 平板：收窄侧栏，缩小间距 */
@media (max-width: 1200px) {
    .hero-content {
        padding: 24px 16px;
        width: 98%;
    }

    .hero-content .hero-info {
        width: 32%;
        padding: 1.5rem 1rem;
    }

    .hero-content .typewriter-box {
        padding: 0 1rem;
    }

    .hero-content .typewriter-box .content-card {
        padding: 1.5rem;
    }
}

/* 小平板 / 大手机：改为纵向堆叠 */
@media (max-width: 968px) {
    .content-layout {
        height: auto;
        overflow: visible;
        align-items: stretch;
    }

    .hero-content {
        flex-direction: column;
        height: auto;
        padding: 16px 12px 24px;
        width: 100%;
        gap: 16px;
    }

    .hero-content .hero-info {
        width: 100%;
        max-width: none;
        height: auto;
        max-height: none;
        overflow-y: visible;
        padding: 1.5rem 1.25rem;
    }

    .hero-content .typewriter-box {
        width: 100%;
        height: auto;
        padding: 0;
        gap: 16px;
        justify-content: flex-start;
    }

    .hero-content .typewriter-box .content-card {
        flex: none;
        height: auto;
        max-height: none;
        padding: 1.25rem;
    }

    .hero-content .typewriter-box .content-card-advantage,
    .hero-content .typewriter-box .content-card-experience {
        flex: none;
    }

    .hero-content .typewriter-box .timeline-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.4rem;
    }

    .hero-content .typewriter-box .company {
        font-size: 0.95rem;
    }
}

/* 手机端：进一步压缩间距与字号 */
@media (max-width: 576px) {
    .hero-content {
        padding: 12px 10px 20px;
        gap: 12px;
    }

    .hero-content .hero-info {
        padding: 1.25rem 1rem;
        border-radius: 12px;

        .avatar-wrapper {
            width: 88px;
            height: 88px;
            margin-bottom: 1rem;
        }

        .user-name {
            font-size: 1.35rem;
            letter-spacing: 1px;
        }

        .user-meta {
            font-size: 0.8rem;
        }

        .job-intent {
            font-size: 0.82rem;
            line-height: 1.5;
        }

        .status-badge {
            font-size: 0.75rem;
        }

        .resume-btn {
            margin-top: 1rem;
            padding: 0.55rem;
            font-size: 0.9rem;
        }

        .divider {
            margin: 1.2rem 0;
        }

        .skill-title {
            font-size: 0.82rem;
        }

        .skill-tag {
            font-size: 0.72rem;
            padding: 0.2rem 0.5rem;
        }
    }

    .hero-content .typewriter-box {
        gap: 12px;

        .content-card {
            padding: 1rem;
            border-radius: 12px;
        }

        .section-main-title {
            font-size: 1.05rem;
            margin-bottom: 1rem;
        }

        .advantage-list {
            padding-left: 1rem;
        }

        .advantage-list li {
            font-size: 0.85rem;
            line-height: 1.65;
            margin-bottom: 0.5rem;
        }

        .timeline {
            padding-left: 1.2rem;
        }

        .timeline-dot {
            left: calc(-1.2rem - 6px);
            width: 8px;
            height: 8px;
        }

        .timeline-item {
            margin-bottom: 1.5rem;
        }

        .time-range {
            font-size: 0.78rem;
        }

        .company {
            font-size: 0.9rem;
        }

        .role {
            font-size: 0.82rem;
        }

        .timeline-body {
            font-size: 0.85rem;
            line-height: 1.55;
        }

        .achievement-list {
            padding-left: 1rem;
        }

        .achievement-list li {
            font-size: 0.85rem;
        }
    }
}

/* 触控设备：取消 hover 位移，避免误触残留 */
@media (hover: none) {
    .hero-content .hero-info .resume-btn:hover {
        transform: none;
    }

    .hero-content .hero-info .skill-tag:hover {
        transform: none;
    }
}
</style>