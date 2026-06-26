<template>
    <div>
        <PageHead title="情绪日志">
        </PageHead>
        <TableSearch :formItem="formItem" @search="handleSearch" />
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="用户ID" prop="id" width="80"></el-table-column>
            <el-table-column label="会话ID" width="100">
                <template #default="scope">
                    <el-avatar>{{ scope.row.username }}</el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="记录日期" prop="diaryDate" width="120"></el-table-column>
            <el-table-column label="情绪评分" prop="moodDescription">
                <template #default="scope">
                    <el-rate v-model="scope.row.moodScore" :max="10" disabled show-score></el-rate>
                </template>
            </el-table-column>
            <el-table-column label="生活指标" prop="createTime" width="120">
                <template #default="scope">
                    <p>睡眠: {{ scope.row.sleepQuality }} / 5</p>
                    <p>运动: {{ scope.row.stressLevel }} / 5</p>
                </template>
            </el-table-column>
            <el-table-column label="情绪触发因素" prop="emotionTriggers" width="120"></el-table-column>
            <el-table-column label="日记内容" prop="diaryContent" width="250"></el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="viewSessionDetail(scope.row)">查看</el-button>
                    <el-button text type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px" layout="prev, pager, next" :page-size="pagination.size"
            :total="pagination.total" @change="handleChange" />
        <el-dialog title="情绪日志详情" v-model="detailDialogVisible" width="800px" :close-on-click-modal="false">
            <div class="detail-content" v-if="currentDetail">
                <div class="detail-session">
                    <h4>用户信息</h4>
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="用户名">{{ currentDetail.username }}</el-descriptions-item>
                        <el-descriptions-item label="昵称">{{ currentDetail.nickname }}</el-descriptions-item>
                        <el-descriptions-item label="用户ID">{{ currentDetail.userId }}</el-descriptions-item>
                        <el-descriptions-item label="记录日期">{{ currentDetail.diaryDate }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <div class="detail-session">
                    <h4>情绪状态</h4>
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="情绪评分">
                            <el-rate v-model="currentDetail.moodScore" :max="10" disabled show-score></el-rate>
                        </el-descriptions-item>
                        <el-descriptions-item label="主要情绪">
                            <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">
                                {{ currentDetail.dominantEmotion }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="睡眠质量">{{ currentDetail.sleepQuality || "-" }} /
                            5</el-descriptions-item>
                        <el-descriptions-item label="压力水平">{{ currentDetail.stressLevel || "-" }} /
                            5</el-descriptions-item>
                    </el-descriptions>
                </div>
                <div class="detail-session">
                    <h4>日记内容</h4>
                    <el-descriptions :column="1" border>
                        <el-descriptions-item label="情绪触发因素">{{ currentDetail.emotionTriggers || "无"
                            }}</el-descriptions-item>
                        <el-descriptions-item label="日记内容">{{ currentDetail.diaryContent || "无"
                            }}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <div class="detail-session">
                    <h4>AI情绪分析结果</h4>
                    <div class="ai-analysis-result">
                        <el-descriptions :column="2" border>
                            <el-descriptions-item label="主要情绪">
                                <el-tag :type="getAiEmotionTagType(aiData.primaryEmotion)">
                                    {{ aiData.primaryEmotion || "无" }}
                                </el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="情绪强度">
                                <el-progress :percentage="aiData.emotionScore || 0"
                                    :color="getEmotionScoreColor(aiData.emotionScore || 0)"
                                    :stroke-width="8"></el-progress>
                            </el-descriptions-item>
                            <el-descriptions-item label="风险等级">
                                <el-tag :type="getRiskLevelTagType(aiData.riskLevel)">
                                    {{ getRiskLevelText(aiData.riskLevel) }}
                                </el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="情绪性质">
                                <el-tag :type="aiData.isNegative ? 'danger' : 'success'">
                                    {{ aiData.isNegative ? '负面情绪' : '正面情绪' }}
                                </el-tag>
                            </el-descriptions-item>
                        </el-descriptions>
                        <div class="ai-suggestion-section">
                            <h5>专业建议</h5>
                            <div class="suggestion-content">
                                {{ aiData.suggestion || "无" }}
                            </div>
                        </div>
                        <div class="ai-risk-section">
                            <h5>风险描述</h5>
                            <div class="risk-content">
                                {{ aiData.riskDescription || "无" }}
                            </div>
                        </div>
                        <div class="ai-improvements-section">
                            <h5>改善建议</h5>
                            <ul class="improvement-list">
                                <li v-for="item in aiData.improvementSuggestions || []" :key="item">
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="detail-session">
                    <h4>时间信息</h4>
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="创建时间">{{ currentDetail.createdAt }}</el-descriptions-item>
                        <el-descriptions-item label="更新时间">{{ currentDetail.updatedAt }}</el-descriptions-item>
                    </el-descriptions>
                </div>
            </div>
            <template #footer>
                <el-button @click="detailDialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { ref, reactive, onMounted } from "vue";
import { getEmotionalPage, deleteEmotional } from "@/api/admin";
import { ElMessageBox, ElMessage } from "element-plus";

const getEmotionTagType = (emotion) => {
    const emptionTypes = {
        "快乐": "success",
        "平静": "info",
        "兴奋": "warning",
        "愤怒": "danger",
        "悲伤": "info",
        "焦虑": "warning",
    }
    return emptionTypes[emotion] || "info";
};

const getAiEmotionTagType = (emotion) => {
    const emptionTagMap = {
        "快乐": "success",
        "平静": "info",
        "兴奋": "warning",
        "满足": "success",
        "愤怒": "danger",
        "悲伤": "info",
        "焦虑": "warning",
        "恐惧": "danger",
        "沮丧": "info",
        "压力": "warning",
    }
    return emptionTagMap[emotion] || "info";
};

const getEmotionScoreColor = (score) => {
    if (score >= 80) {
        return "#f56c6c"; // 红色
    } else if (score >= 60) {
        return "#ffa500"; // 橙色
    } else if (score >= 40) {
        return "#ffa500"; // 橙色
    } else {
        return "#ff4444"; // 红色
    }
};

const getRiskLevelTagType = (riskLevel) => {
    const riskTagMap = {
        0: "success",
        1: "info",
        2: "warning",
        3: "danger",
    }
    return riskTagMap[riskLevel] || "info";
};

const getRiskLevelText = (riskLevel) => {
    const riskTextMap = {
        0: "正常",
        1: "关注",
        2: "预警",
        3: "危急",
    }
    return riskTextMap[riskLevel] || "未知风险等级";
};

const tableData = ref([]);

const formItem = [
    {
        label: "用户ID",
        prop: "userId",
        type: "input",
        placeholder: "请输入用户ID",
    },
    {
        label: "情绪评分",
        prop: "moodScoreRange",
        type: "select",
        placeholder: "请选择情绪评分范围",
        options: [
            { label: "低分（1-3）", value: '1-3' },
            { label: "中分（4-6）", value: '4-6' },
            { label: "高分（7-10）", value: '7-10' },
        ],
    }
]

//分页参数
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

const handleSearch = async (formData) => {
    const params = {
        ...pagination,
        ...formData
    }
    const data = await getEmotionalPage(params)

    const { records, total } = data
    tableData.value = records
    pagination.total = total
}

const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
}
onMounted(() => {
    handleSearch()
})

const detailDialogVisible = ref(false);

const currentDetail = ref(null)

const aiData = ref(null)

const viewSessionDetail = (row) => {
    currentDetail.value = row
    if (row.aiEomotionAnalysis) {
        aiData.value = JSON.parse(row.aiEmotionAnalysis)
    } else {
        aiData.value = {}
    }
    detailDialogVisible.value = true
}

const handleDelete = (row) => {
    ElMessageBox.confirm(`确定删除用户ID为 ${row.userId} 的情绪日志吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger',
    }).then(() => {
        // 调用删除接口
        deleteEmotional(row.id).then(() => {
            ElMessage.success('删除成功');
            handleSearch();
        });
    }).catch(() => {
        console.log('取消删除');
    });
};
</script>
<style lang="scss" scoped>
.detail-content {
    .detail-session {
        margin-bottom: 20px;

        h4 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .ai-analysis-result {
            .el-descriptions {
                margin-bottom: 10px;
            }

            .ai-suggestion-section,
            .ai-risk-section,
            .ai-improvements-section {
                margin-top: 10px;

                h5 {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .suggestion-content,
                .risk-content,
                .improvement-list {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 4px;
                }

                .improvement-list {
                    list-style-type: disc;
                    padding-left: 20px;
                }
            }
        }
    }
}
</style>