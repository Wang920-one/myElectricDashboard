<template>
    <div class="project-cards">
        <el-carousel height="90vh" trigger="hover" :autoplay="false" :interval="5000">
            <el-carousel-item v-for="item in demoList" :key="item.id">
                <div class="demo-box">
                    <h3 style="padding-bottom: 10px;">{{ item.title }}</h3>
                    <div class="demo-inner">
                        <component :is="item.componentName" />
                        <!-- 悬浮遮罩介绍 -->
                        <div class="demo-mask">
                            <!-- <h4>{{ item.title }}</h4> -->
                            <p>{{ item.intro }}</p>
                        </div>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup>
import VisualScreen from '@/components/myinfo/InVisualScreen.vue'
import ThreeScene from '@/components/myinfo/InThreeScene.vue'
import MobileModule from '@/views/login.vue'

const demoList = [
    {
        id: 1, title: '电力数据可视化大屏',
        intro: '基于Vue3+ECharts开发，适配大屏分辨率，展示电力行业多维度业务数据，支持实时刷新与数据筛选',
        componentName: VisualScreen
    },
    {
        id: 2, title: '3D厂区数字孪生',
        intro: '依托Three.js搭建三维仿真场景，支持视角拖拽缩放、设备点位标注，实现工业园区可视化漫游交互',
        componentName: ThreeScene
    },
    {
        id: 3, title: '心理健康AI助手',
        intro: 'AI全栈项目，vue3+SpringBoot+SpringAI项目实战，Trae编程实战，SSE流式通讯，前后端权限隔离，AI智能赋能，数据可视化',
        componentName: MobileModule
    }
]
</script>

<style lang="scss" scoped>
.project-cards {
    width: 100%;
    height: 90vh;

    /* 分割线文字渐变样式 完美生效 */
    :deep(.el-divider__text) {
        background-image: linear-gradient(135deg, #f5f7fa3d 0%, #c3cfe262 100%) !important;
        background-color: transparent !important;
        color: #333 !important;
        padding: 0 20px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        position: absolute !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        border: none !important;
        box-shadow: none !important;
    }

    :deep(.el-divider) {
        margin: 40px 0;
        border-color: #e8e8e81c !important;
    }

    /* 走马灯整体样式 */
    .demo-wrap {
        width: 100%;
        border-radius: 16px;
        overflow: hidden;
    }

    .demo-box {
        width: 100%;
        height: 100%;
        padding: 24px;
        background: #ffffff1f;
    }

    .demo-title {
        font-size: 17px;
        color: #222;
        margin-bottom: 16px;
        font-weight: 500;
    }

    .demo-inner {
        width: 100%;
        height: calc(100% - 40px);
        background: #f8f9fa4f;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    /* 走马灯指示器优化 */
    :deep(.el-carousel__indicator.is-active .el-carousel__button) {
        background-color: #409eff;
    }

    /* 悬浮遮罩默认透明 */
    .demo-mask {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 20px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
        color: #fff;
        transform: translateY(60%);
        transition: all 0.3s ease;
    }

    .demo-inner:hover .demo-mask {
        transform: translateY(0);
    }

    .demo-mask h4 {
        font-size: 16px;
        margin-bottom: 8px;
    }

    .demo-mask p {
        font-size: 13px;
        line-height: 1.6;
        opacity: 0.95;
    }
}
</style>