<template>
    <div class="dashboard-container">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card v-if="aiData.systemOverview" class="box-card">
                    <div slot="header" class="card-content">
                        <div class="avator users">
                            <img :src="iconUrl1" style="width: 40px;height: 40px;" />
                        </div>
                        <div class="info">
                            <p class="title">总用户数</p>
                            <p class="number">{{ aiData.systemOverview.totalUsers }}</p>
                            <p class="subtitle-title">活跃用户：{{ aiData.systemOverview.activeUsers }}</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card v-if="aiData.systemOverview" class="box-card">
                    <div slot="header" class="card-content">
                        <div class="avator like">
                            <img :src="iconUrl2" style="width: 40px;height: 40px;" />
                        </div>
                        <div class="info">
                            <p class="title">情绪日志</p>
                            <p class="number">{{ aiData.systemOverview.totalDiaries }}</p>
                            <p class="subtitle-title">今日新增：{{ aiData.systemOverview.todayNewDiaries }}</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card v-if="aiData.systemOverview" class="box-card">
                    <div slot="header" class="card-content">
                        <div class="avator coments">
                            <img :src="iconUrl3" style="width: 40px;height: 40px;" />
                        </div>
                        <div class="info">
                            <p class="title">咨询会话</p>
                            <p class="number">{{ aiData.systemOverview.totalSessions }}</p>
                            <p class="subtitle-title">今日新增：{{ aiData.systemOverview.todayNewSessions }}</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card v-if="aiData.systemOverview" class="box-card">
                    <div slot="header" class="card-content">
                        <div class="avator smile">
                            <img :src="iconUrl4" style="width: 40px;height: 40px;" />
                        </div>
                        <div class="info">
                            <p class="title">平均情绪</p>
                            <p class="number">{{ aiData.systemOverview.avgMoodScore }} / 10</p>
                            <p class="subtitle-title">情绪健康指数</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="12">
                <el-card style="width:100%;height:100%;">
                    <template #header>
                        <div class="card-header">
                            情绪趋势分析
                        </div>
                    </template>
                    <div class="chart-container">
                        <div ref="emotionChartRef" style="width: 100%; height: 300px;"></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            咨询会话统计
                        </div>
                    </template>
                    <div class="chart-content">
                        <div v-if="aiData.consultationStats" class="consultation-stats">
                            <div class="stat-item">
                                <div class="stat-label">总会话数</div>
                                <div class="stat-value">{{ aiData.consultationStats.totalSessions }}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">平均时长</div>
                                <div class="stat-value">{{ aiData.consultationStats.avgDurationMinutes }}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">活跃用户</div>
                                <div class="stat-value">{{ aiData.systemOverview.activeUsers }}</div>
                            </div>
                        </div>
                        <div ref="consultationChartRef" style="width: 100%; height: 260px;"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="24">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            用户活跃度趋势
                        </div>
                    </template>
                    <div class="chart-container">
                        <div ref="userActivityChartRef" style="width: 100%; height: 260px;"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getAnalysisOverview } from "@/api/admin";
import { te } from "element-plus/es/locales.mjs";
import * as echarts from "echarts";

//统计图片引入
const iconUrl1 = new URL("@/assets/images/logo.png", import.meta.url).href;
const iconUrl2 = new URL("@/assets/images/logo.png", import.meta.url).href;
const iconUrl3 = new URL("@/assets/images/logo.png", import.meta.url).href;
const iconUrl4 = new URL("@/assets/images/logo.png", import.meta.url).href;

const aiData = ref({})

//情绪趋势
let emotionChart = null
const emotionChartRef = ref(null)

//初始化图表
const initChats = () => {
    initEmotionChart()
    initConsultationChart()
    initUserActivityChart()
}

const initEmotionChart = () => {
    if (!emotionChartRef.value) return;
    //销毁现有图表
    if (emotionChart) {
        emotionChart.dispose();
    }
    //初始化图表
    emotionChart = echarts.init(emotionChartRef.value);
    //获取情绪趋势的 数据
    const TrendData = aiData.value.emotionTrend || [];
    //配置图表选项
    const option = {
        title: {
            text: '情绪趋势分析',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333'
            },
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            borderColor: '#fabf1c',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            }
        },
        legend: {
            data: ['平均情绪评分', '记录数量'],
            top: 40,
            textStyle: {
                color: '#333'
            }
        },
        xAxis: {
            type: 'category',
            data: TrendData.map(item => item.date),
            axisLabel: {
                color: '#333'
            },
            axisLine: {
                lineStyle: {
                    color: '#2d343d'
                }
            }
        },
        yAxis: [{
            type: 'value',
            name: '情绪评分',
            position: 'left',
            axisLabel: {
                color: '#333'
            },

            min: 0,
            max: 10
        },
        {
            type: 'value',
            name: '记录数量',
            position: 'right',
            axisLabel: {
                color: '#333'
            },
            min: 0
        }],
        series: [
            {
                name: '平均情绪评分',
                type: 'line',
                data: TrendData.map(item => item.avgMoodScore),
                smooth: true,
                lineStyle: {
                    color: '#409EFF',
                    width: 2
                },
                itemStyle: {
                    color: '#409EFF'
                }
            }, {
                name: '记录数量',
                type: 'line',
                data: TrendData.map(item => item.recordCount),
                smooth: true,
                lineStyle: {
                    color: '#67C23A',
                    width: 2
                },
                itemStyle: {
                    color: '#67C23A'
                }
            }
        ]
    };
    emotionChart.setOption(option);
};


//咨询会话统计
let consultationChart = null
const consultationChartRef = ref(null)

const initConsultationChart = () => {
    if (!consultationChartRef.value) return;
    //销毁现有图表
    if (consultationChart) {
        consultationChart.dispose();
    }
    //初始化图表
    consultationChart = echarts.init(consultationChartRef.value);
    //获取咨询会话统计数据
    const consultationData = aiData.value.consultationStats.dailyTrend || [];
    //配置图表选项
    const option = {
        title: {
            text: '咨询会话统计',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333'
            },
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            borderColor: '#fabf1c',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            }
        },
        legend: {
            data: ['会话数量', '参与用户数'],
            top: 40,
            textStyle: {
                color: '#333'
            }
        },
        xAxis: {
            type: 'category',
            data: consultationData.map(item => item.date),
            axisLabel: {
                color: '#333'
            },
            axisLine: {
                lineStyle: {
                    color: '#2d343d'
                }
            }
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                color: '#333'
            },
            minInterval: 1
        },
        {
            type: 'value',
            axisLabel: {
                color: '#333'
            },
            minInterval: 1
        }],
        series: [{
            name: '会话数量',
            type: 'bar',
            data: consultationData.map(item => item.sessionCount),
            itemStyle: {
                color: '#409EFF'
            }
        }, {
            name: '参与用户数',
            type: 'bar',
            data: consultationData.map(item => item.userCount),
            itemStyle: {
                color: '#67C23A'
            }
        }]
    };
    consultationChart.setOption(option);
};

//用户活跃度趋势
let userActivityChart = null
const userActivityChartRef = ref(null)

const initUserActivityChart = () => {
    if (!userActivityChartRef.value) return;
    //销毁现有图表
    if (userActivityChart) {
        userActivityChart.dispose();
    }
    //初始化图表
    userActivityChart = echarts.init(userActivityChartRef.value);
    //获取用户活跃度趋势数据
    const userActivityData = aiData.value.userActivity || [];
    //配置图表选项
    const option = {
        title: {
            text: '咨询会话统计',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333'
            },
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            borderColor: '#fabf1c',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            }
        },
        legend: {
            data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
            top: 40,
            textStyle: {
                color: '#333'
            }
        },
        xAxis: {
            type: 'category',
            data: userActivityData.map(item => item.date),
            axisLabel: {
                color: '#333'
            },
            axisLine: {
                lineStyle: {
                    color: '#2d343d'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#333'
            },
            minInterval: 1
        },
        series: [{
            name: '活跃用户',
            type: 'line',
            data: userActivityData.map(item => item.activeUsers),
            smooth: true,
            lineStyle: {
                color: '#409EFF',
                width: 2
            },
            itemStyle: {
                color: '#409EFF'
            }
        },{
            name: '新增用户',
            type: 'line',
            data: userActivityData.map(item => item.newUsers),
            smooth: true,
            lineStyle: {
                color: '#67C23A',
                width: 2
            },
            itemStyle: {
                color: '#67C23A'
            }
        },{
            name: '日记用户',
            type: 'line',
            data: userActivityData.map(item => item.diaryUsers),
            smooth: true,
            lineStyle: {
                color: '#E6A23C',
                width: 2
            },
            itemStyle: {
                color: '#E6A23C'
            }
        },{
            name: '咨询用户',
            type: 'line',
            data: userActivityData.map(item => item.consultationUsers),
            smooth: true,
            lineStyle: {
                color: '#F56C6C',
                width: 2
            },
            itemStyle: {
                color: '#F56C6C'
            }
        }]
    };
    userActivityChart.setOption(option);
};
onMounted(() => {
    getAnalysisOverview().then((res) => {
        console.log("分析概览数据", res);
        aiData.value = res
        initChats()
    });
});
</script>
<style lang="scss" scoped>
.box-card {
    width: 100%;
    height: 100%;
    .card-content {
        display: flex;
        align-items: center;
        .avator {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 20px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .info {
            .title {
                font-size: 14px;
                color: #666;
            }
            .number {
                font-size: 24px;
                font-weight: bold;
                color: #333;
            }
            .subtitle-title {
                font-size: 12px;
                color: #999;
            }
        }
    }
}
.chart-content {
    .consultation-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
            text-align: center;

            .stat-label {
                font-size: 14px;
                color: #666;
            }

            .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #333;
            }
        }
    }
}
</style>
