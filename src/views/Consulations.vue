<template>
    <div>
        <PageHead title="咨询记录"></PageHead>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="会话ID" width="100">
                <template #default="scope">
                    <el-avatar>{{ scope.row.userNickname }}</el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="情绪日志">
                <template #default="scope">
                    <div class="session-title">
                        {{ scope.row.sessionTitle }}
                    </div>
                    <div class="session-preview">
                        {{ scope.row.lastMessageContent }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="消息数" width="100" prop="messageCount">
            </el-table-column>
            <el-table-column label="时间" width="100" prop="lastMessageTime">
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="viewSessionDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px" layout="prev, pager, next" :page-size="pagination.size"
            :total="pagination.total" @change="handleChange" />
        <el-dialog title="咨询会话详情" v-model="showDetailDialog" width="70%" :close-on-click-modal="false">
            <div class="session-detail">
                <div class="detail-header">
                    <div class="detail-row">
                        <div class="detail-label">用户:</div>
                        <div class="detail-value">{{ sessionDetail.userNickname }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">开始时间:</div>
                        <div class="detail-value">{{ sessionDetail.startedAt }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">消息数:</div>
                        <div class="detail-value">{{ sessionDetail.messageCount }}</div>
                    </div>
                </div>
                <div class="messages-container">
                    <div class="message-header">
                        <h4>对话记录</h4>
                    </div>
                    <div class="message-list" v-loading="loadingMessages">
                        <div v-for="message in sessionDetail.messages" :key="message.id" class="message-row"
                            :class="message.senderType === 1 ? 'user-message' : 'ai-message'">
                            <div class="message-header">
                                <span class="sender-type">{{ message.senderType === 1 ? '用户' : 'AI助手' }}</span>
                                <span class="sender-time">{{ message.createdAt }}</span>
                            </div>
                            <div class="message-content">{{ message.content }}</div>
                            <div class="message-time">{{ message.timestamp }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button @click="showDetailDialog = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import PageHead from "@/components/PageHead.vue";
import { onMounted, ref, reactive } from "vue";
import { getConsultationPage, getSessionDetail } from "@/api/admin";
import { el } from "element-plus/es/locales.mjs";

const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

const tableData = ref([])

onMounted(() => {
    handleSearch()
})

const sessionDetail = ref({})

const showDetailDialog = ref(false)

const loadingMessages = ref(false)

const viewSessionDetail = (row) => {
    loadingMessages.value = true
    getSessionDetail(row.id).then(res => {
        showDetailDialog.value = true
        // sessionMessages.value = res
        sessionDetail.value = { ...row, messages: res }
        loadingMessages.value = false
    })
}

const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
}
const handleSearch = () => {
    getConsultationPage(pagination).then(res => {
        const { records, total } = res
        tableData.value = records
        pagination.total = total
    })
}

</script>

<style lang="scss" scoped>
.session-detail{
    .detail-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        .detail-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .detail-label {
                font-weight: bold;
                margin-right: 10px;
            }
            .detail-value {
                color: #666;
            }
        }
    }
    .messages-container {
        border-top: 1px solid #eee;
        padding-top: 20px;
        .message-header {
            margin-bottom: 10px;
            h4 {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
            }
        }
        .message-list {
            max-height: 400px;
            overflow-y: auto;
            .message-row {
                padding: 10px;
                border-bottom: 1px solid #eee;
                &.user-message {
                    background-color: #f5f5f5;
                }
                &.ai-message {
                    background-color: #e6f7ff;
                }
                .message-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    .sender-type {
                        font-weight: bold;
                    }
                    .sender-time {
                        color: #999;
                        font-size: 12px;
                    }
                }
                .message-content {
                    margin-bottom: 5px;
                }
                .message-time {
                    color: #999;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>