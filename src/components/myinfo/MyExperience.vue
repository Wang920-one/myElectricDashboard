<template>
    <div class="home-container">
        <main class="main-layout">
            <section class="content-grid">

                <!-- 学习心得 -->
                <div class="content-card">
                    <h2 class="section-main-title">📚 学习心得</h2>
                    <div class="card-scroll">
                        <div class="note-list">
                            <a
                                v-for="note in notes"
                                :key="note.title"
                                :href="note.url"
                                class="note-item"
                                target="_blank"
                                rel="noopener noreferrer"
                                @click="handleLinkClick($event, note.url)"
                            >
                                <div class="note-main">
                                    <span class="note-title">{{ note.title }}</span>
                                    <div class="note-meta">
                                        <span class="time-range">{{ note.date }}</span>
                                        <span
                                            v-for="tag in note.tags"
                                            :key="tag"
                                            class="skill-tag skill-tag-sm"
                                        >
                                            {{ tag }}
                                        </span>
                                    </div>
                                </div>
                                <span class="note-arrow">→</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 兴趣爱好 -->
                <div class="content-card">
                    <h2 class="section-main-title">🎬 兴趣爱好</h2>
                    <div class="card-scroll">
                        <div class="hobby-grid">
                            <div v-for="hobby in hobbies" :key="hobby.name" class="hobby-card">
                                <span class="hobby-icon">{{ hobby.icon }}</span>
                                <h3 class="hobby-name">{{ hobby.name }}</h3>
                                <p class="hobby-desc">{{ hobby.desc }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 博客与链接 -->
                <div class="content-card">
                    <h2 class="section-main-title">🔗 博客与链接</h2>
                    <div class="card-scroll">
                        <div class="link-list">
                            <a
                                v-for="link in blogLinks"
                                :key="link.name"
                                :href="link.url"
                                class="link-item"
                                target="_blank"
                                rel="noopener noreferrer"
                                @click="handleLinkClick($event, link.url)"
                            >
                                <span class="link-icon">{{ link.icon }}</span>
                                <div class="link-info">
                                    <span class="link-name">{{ link.name }}</span>
                                    <span class="link-desc">{{ link.desc }}</span>
                                </div>
                                <span class="link-arrow">→</span>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- 最近在想什么 -->
                <div class="content-card">
                    <h2 class="section-main-title">💭 最近在想什么</h2>
                    <div class="card-scroll">
                        <div class="thought-timeline">
                            <div
                                v-for="item in thoughts"
                                :key="item.date + item.title"
                                class="thought-item"
                            >
                                <div class="thought-dot"></div>
                                <div class="thought-header">
                                    <span class="time-range">{{ item.date }}</span>
                                    <span class="thought-title">{{ item.title }}</span>
                                </div>
                                <p class="thought-content">{{ item.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Thought {
    date: string
    title: string
    content: string
}

interface Note {
    title: string
    tags: string[]
    date: string
    url: string
}

interface Hobby {
    icon: string
    name: string
    desc: string
}

interface BlogLink {
    icon: string
    name: string
    desc: string
    url: string
}

const thoughts = ref<Thought[]>([
    {
        date: '2025.11',
        title: '关于「前端 + 视觉」的交叉',
        content:
            '做新媒体运营后，发现排版和留白意识反而提升了写组件的直觉。技术实现和视觉表达并不是两条平行线，而是可以互相滋养的。',
    },
    {
        date: '2025.09',
        title: '自学 Vue3 的几点体会',
        content:
            'Composition API 真正有价值的是逻辑复用，而不是语法新。把业务按功能拆成 composable，比按选项类型堆代码清晰得多。',
    },
    {
        date: '2025.06',
        title: '离职间隙的思考',
        content:
            '空白期不是断层，而是主动升级窗口。用项目驱动学习，比单纯刷文档更有动力，也更容易沉淀成可展示的成果。',
    },
])

const notes = ref<Note[]>([
    {
        title: 'Vue3 响应式原理梳理',
        tags: ['Vue3', '源码'],
        date: '2025-10',
        url: '#',
    },
    {
        title: 'Three.js 大模型性能优化实践',
        tags: ['Three.js', '3D'],
        date: '2025-08',
        url: '#',
    },
    {
        title: 'ECharts 高频刷新下的性能方案',
        tags: ['ECharts', '可视化'],
        date: '2025-07',
        url: '#',
    },
    {
        title: 'UniApp 与工业硬件交互踩坑记录',
        tags: ['UniApp', '跨端'],
        date: '2024-12',
        url: '#',
    },
])

const hobbies = ref<Hobby[]>([
    {
        icon: '🎥',
        name: '短视频剪辑',
        desc: '活动记录、旅拍 vlog，用剪映和 PR 完成从素材到成片的完整流程。',
    },
    {
        icon: '📷',
        name: '无人机航拍',
        desc: '喜欢用航拍视角记录城市与风光，也在练习构图与运镜节奏。',
    },
    {
        icon: '🎨',
        name: '视觉排版',
        desc: '新媒体运营经历锻炼了排版直觉，反哺到前端 UI / UX 的细节把控。',
    },
    {
        icon: '📚',
        name: '阅读与输出',
        desc: '习惯把学到的东西整理成笔记，逼自己把模糊的理解说清楚。',
    },
])

const blogLinks = ref<BlogLink[]>([
    {
        icon: '📝',
        name: '个人博客',
        desc: '技术文章与学习记录（筹备中）',
        url: '#',
    },
    {
        icon: '🐙',
        name: 'GitHub',
        desc: '开源项目与 Demo 仓库',
        url: 'https://github.com',
    },
    {
        icon: '💎',
        name: '掘金主页',
        desc: '零散技术笔记与阅读摘要',
        url: 'https://juejin.cn',
    },
    {
        icon: '🎬',
        name: '创作作品集',
        desc: '短视频与视觉作品合集（筹备中）',
        url: '#',
    },
])

const handleLinkClick = (event: MouseEvent, url: string) => {
    if (!url || url === '#') {
        event.preventDefault()
    }
}
</script>

<style lang="scss" scoped>
.home-container {
    width: 92%;
    max-width: 1440px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    padding: 0 2%;
    box-sizing: border-box;
}

.main-layout {
    width: 100%;
}

/* 四宫格 — 宽高按视口百分比 */
.content-grid {
    display: grid;
    grid-template-columns: repeat(2, 48%);
    grid-template-rows: repeat(2, 46%);
    justify-content: space-between;
    align-content: space-between;
    gap: 2%;
    width: 100%;
    height: 88vh;
    min-height: 560px;
    max-height: 920px;
}

.content-card {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
    background: rgba(255, 255, 255, 0.185);
    padding: 2rem;
    overflow: hidden;
}

.card-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(100, 100, 100, 0.25);
        border-radius: 4px;
    }
}

.section-main-title {
    font-size: 1.25rem;
    color: #1e293b;
    margin-bottom: 1.2rem;
    flex-shrink: 0;
    position: relative;
    padding-bottom: 0.4rem;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 35px;
        height: 3px;
        background: #4f46e5;
        border-radius: 2px;
    }
}

.time-range {
    font-size: 0.78rem;
    font-weight: 600;
    background: rgba(79, 70, 229, 0.08);
    color: #4f46e5;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
}

.skill-tag {
    font-size: 0.72rem;
    background: rgba(255, 255, 255, 0.8);
    color: #475569;
    padding: 0.15rem 0.45rem;
    border-radius: 6px;
    border: 1px solid rgba(226, 232, 240, 0.8);
}

.skill-tag-sm {
    font-size: 0.68rem;
}

/* 想法时间线 */
.thought-timeline {
    position: relative;
    padding-left: 1.2rem;
    border-left: 2px solid rgba(203, 213, 225, 0.6);
}

.thought-item {
    position: relative;
    margin-bottom: 1.2rem;

    &:last-child {
        margin-bottom: 0;
    }
}

.thought-dot {
    position: absolute;
    left: calc(-1.2rem - 5px);
    top: 4px;
    width: 8px;
    height: 8px;
    background: #4f46e5;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.thought-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
}

.thought-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1e293b;
}

.thought-content {
    font-size: 0.9rem;
    line-height: 1.7;
    color: #475569;
}

/* 学习笔记 */
.note-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.note-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.65rem 0.75rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.45);
    border: 1px solid rgba(226, 232, 240, 0.6);
    text-decoration: none;
    color: inherit;
    transition: all 0.25s ease;

    &:hover {
        background: rgba(79, 70, 229, 0.06);
        border-color: rgba(79, 70, 229, 0.25);

        .note-arrow {
            color: #4f46e5;
        }
    }
}

.note-main {
    flex: 1;
    min-width: 0;
}

.note-title {
    display: block;
    font-size: 0.92rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.3rem;
    line-height: 1.4;
}

.note-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
}

.note-arrow {
    font-size: 1rem;
    color: #94a3b8;
    flex-shrink: 0;
}

/* 兴趣（卡片内单列） */
.hobby-grid {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.hobby-card {
    padding: 0.75rem 0.85rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.45);
    border: 1px solid rgba(226, 232, 240, 0.6);
    transition: all 0.25s ease;

    &:hover {
        border-color: rgba(79, 70, 229, 0.2);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.06);
    }
}

.hobby-icon {
    font-size: 1.3rem;
    display: block;
    margin-bottom: 0.3rem;
}

.hobby-name {
    font-size: 0.92rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
}

.hobby-desc {
    font-size: 0.85rem;
    line-height: 1.55;
    color: #64748b;
}

/* 链接列表 */
.link-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.link-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.65rem 0.5rem;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.25s ease;

    &:not(:last-child) {
        border-bottom: 1px solid rgba(226, 232, 240, 0.45);
    }

    &:hover {
        background: rgba(79, 70, 229, 0.06);

        .link-arrow {
            color: #4f46e5;
        }
    }
}

.link-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
}

.link-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.link-name {
    font-size: 0.92rem;
    font-weight: 600;
    color: #1e293b;
}

.link-desc {
    font-size: 0.82rem;
    color: #64748b;
    line-height: 1.4;
}

.link-arrow {
    font-size: 0.95rem;
    color: #94a3b8;
    flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 968px) {
    .home-container {
        width: 100%;
        padding: 0 3% 2rem;
    }

    .content-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        justify-content: stretch;
        align-content: stretch;
        gap: 1.2rem;
        height: auto;
        min-height: unset;
        max-height: none;
    }

    .content-card {
        height: auto;
        min-height: 280px;
        max-height: none;
        padding: 1.25rem;
    }
}

@media (max-width: 576px) {
    .home-container {
        padding: 0 10px 1.5rem;
    }

    .content-card {
        padding: 1rem;
        border-radius: 12px;
    }

    .section-main-title {
        font-size: 1rem;
    }

    .thought-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.3rem;
    }
}

@media (hover: none) {
    .hobby-card:hover,
    .note-item:hover {
        transform: none;
    }
}
</style>
