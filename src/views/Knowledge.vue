<template>
    <div>
        <PageHead title="知识文章">
            <template #buttons>
                <el-button type="primary" @click="handleEdit({})">新增</el-button>
            </template>
        </PageHead>
        <TableSearch :formItem="formItem" @search="handleSearch" />
        <el-table :data="tableData" style="width: 100%;margin-top: 25px;">
            <el-table-column label="文章标题" fixed="left" min-width="300">
                <template #default="scope">
                    <div style="display: flex;align-items: center;">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span>{{ scope.row.title }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="分类" width="200">
                <template #default="scope">
                    <div style="display: flex;align-items: center;">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span>{{ categoryMap[scope.row.categoryId] }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="作者" width="150" prop="authorName">
            </el-table-column>
            <el-table-column label="阅读量" width="150" prop="readCount">
            </el-table-column>
            <el-table-column label="发布时间" width="200" prop="updatedAt">
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button v-if="scope.row.status === 0 || scope.row.status === 2" text type="success" size="small"
                        @click="handlePublish(scope.row)">发布</el-button>
                    <el-button v-if="scope.row.status === 1" text type="warning" size="small"
                        @click="handleUnpublish(scope.row)">下线</el-button>
                    <el-button text type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px" layout="prev, pager, next" :page-size="pagination.size"
            :total="pagination.total" @change="handleChange" />
        <ArticalDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categories="categories"
            @success="handleSuccess" />
    </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { categoryTree, getArticlePage, getArticleDetail, changeArticleStatus, deleteArticle } from "@/api/admin";
import { it } from "element-plus/es/locales.mjs";
import ArticalDialog from "@/components/ArticalDialog.vue";
import { ElMessageBox,ElMessage } from "element-plus";

const formItem = [
    {
        label: "文章标题",
        prop: "title",
        type: "input",
        placeholder: "请输入文章标题",
    },
    {
        label: "分类",
        prop: "category",
        type: "select",
        placeholder: "请选择分类",
    },
    {
        label: "状态",
        prop: "status",
        type: "select",
        placeholder: "请选择状态",
        options: [
            { label: "草稿", value: 0 },
            { label: "已发布", value: 1 },
            { label: "已下架", value: 2 },
        ],
    },
]
//新增和编辑
const dialogVisible = ref(false);
const currentArticle = ref(null);

//编辑
const handleEdit = (row) => {
    console.log('row')
    if (row && row.id) {
        getArticleDetail(row.id).then(data => {
            console.log('文章详情', data)
            currentArticle.value = data
            dialogVisible.value = true
        })
    } else {
        //新增
        console.warn('无效的文章数据')
        currentArticle.value = null
        dialogVisible.value = true
    }
}

//发布
const handlePublish = (row) => {
    ElMessageBox.confirm('确定要发布该文章吗？', '确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
    }).then(() => {
        //调用发布接口
        changeArticleStatus(row.id, { status: 1 }).then(() => {
            ElMessage.success('发布成功')
            handleSearch()
        })
    }).catch(() => {
        console.log('取消发布')
    });
}

//下线
const handleUnpublish = (row) => {
    ElMessageBox.confirm('确定要下线该文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        //调用下线接口
        changeArticleStatus(row.id, { status: 2 }).then(() => {
            ElMessage.success('下线成功')
            handleSearch()
        })
    }).catch(() => {
        console.log('取消下线')
    });
}

//删除
const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger',
    }).then(() => {
        deleteArticle(row.id).then(() => {
            ElMessage.success('删除成功')
            handleSearch()
        })
    }).catch(() => {
        console.log('取消删除')
    });
}

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
    const data = await getArticlePage(params)

    const { records, total } = data
    tableData.value = records
    pagination.total = total

};

const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
}

//分类映射
const categoryMap = reactive({});
//分类列表
const categories = ref([]);
//列表数据
const tableData = ref([]);

onMounted(async () => {
    const data = await categoryTree()

    categories.value = data.map(item => {
        categoryMap[item.id] = item.categoryName
        return {
            label: item.categoryName,
            value: item.id
        }
        formItem[2].options = categories.value
    })

    //初始加载文章列表
    handleSearch()
})

const handleSuccess = () => {
    dialogVisible.value = false
    handleSearch()
}

</script>