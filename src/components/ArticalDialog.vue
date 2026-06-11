<template>
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑文章' : '创建文章'" width="50%" @close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
            </el-form-item>
            <el-form-item label="文章分类" prop="categoryId">
                <el-select v-model="formData.categoryId" placeholder="请选择文章分类">
                    <el-option v-for="category in props.categories" :key="category.value" :label="category.label"
                        :value="category.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="summary">
                <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000"
                    show-word-limit :rows="4" />
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <el-select v-model="formData.tagArray" placeholder="请输入文章标签(逗号分隔)" multiple filterable allow-create
                    style="width: 100%;">
                    <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
                </el-select>
            </el-form-item>
            <el-form-item label="封面图片">
                <div class="cover-upload">
                    <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeUpload"
                        :http-request="handleUploadRequest" accept="image/*">
                        <div v-if="!imageUrl" class="cover-placeholder">点击上传封面</div>
                        <img v-else :src="imageUrl" class="cover-preview" />
                        <!-- <el-button size="small" type="primary">点击上传封面图片</el-button> -->
                    </el-upload>
                    <div v-if="imageUrl" style="margin-top: 10px;">
                        <el-button size="small" type="danger" @click="handleRemove">移除封面</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <rich-text-editor v-model="formData.content" placeholder="请输入文章内容..." :max-char-count="5000"
                    @change="handleContentChange" @created="handleEditorCreated" min-height="400px" />
            </el-form-item>
        </el-form>
        <div v-if="btnPreview">
            <h3>文章预览</h3>
            <div v-html="formData.content"></div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSubmit()">{{ isEdit ? '修 改' : '创 建' }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { el } from 'element-plus/es/locales.mjs';
import { reactive, ref, computed, nextTick, watch } from "vue";
import { ElFormItem, ElMessage } from 'element-plus';
import { uploadFile, createArticle, updateArticle } from '@/api/admin';
import { fileBaseUrl } from '@/config';
import RichTextEditor from '@/components/RichTextEditor.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    categories: {
        type: Array,
        default: () => [],
    },
    article: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const rules = {
    title: [{ required: true, message: "请输入文章标题", trigger: "blur" }, { max: 200, message: "标题不能超过200字", trigger: "blur" }],
    categoryId: [{ required: true, message: "请选择文章分类", trigger: "change" }],
    content: [{ required: true, message: "请输入文章内容", trigger: "blur" }, { max: 5000, message: "内容不能超过5000字", trigger: "blur" }],
};

const dialogVisible = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        // 这里可以监听modelValue的变化，进行一些副作用操作
        emit('update:modelValue', value);
    }
});

const isEdit = computed(() => !!props.article?.id);

//监听编辑数据
watch(() => props.article, (newVal) => {
    if (newVal) {
        nextTick(() => { // 确保在DOM更新后执行
            Object.assign(formData, newVal)
            //使用现有ID
            businessId.value = newVal.id
            //封面图片
            imageUrl.value = fileBaseUrl + newVal.coverImage
        })
    }
})

const handleClose = () => {
    // 关闭对话框时清空文章数据
    formRef.value.resetFields();
    businessId.value = null;
    formData.tagArray = [];
    handleRemove(); //清除封面图片
    emit('update:modelValue', false);
};

const formRef = ref();
//表单数据
const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": ""
});

const commonTags = ['情绪管理', '人际关系', '职场压力', '心理健康', '自我提升', '时间管理', '学习方法', '生活习惯', '情感问题', '家庭关系'];

//上传
const imageUrl = ref('');
const beforeUpload = (file) => {
    //针对上传的文件进行校验
    console.log("上传文件", file);
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) {
        ElMessage.error('只能上传图片文件');
        return false;
    }
    if (!isLt5M) {
        ElMessage.error('文件大小不能超过5MB');
        return false;
    }
    return true;
};
const businessId = ref(null); //默认使用'temp'作为临时业务ID，编辑时会替换为文章ID
const handleUploadRequest = async ({ file }) => {
    //UUID生成唯一文件名，防止文件名冲突
    businessId.value = formData.id || crypto.randomUUID(); //如果是编辑文章，使用文章ID作为业务ID，否则使用'temp'
    try {
        const response = await uploadFile(file, { businessId: businessId.value });
        // imageUrl.value = response.data.url;
        //假设后端返回的URL是相对路径，需要拼接成完整URL
        imageUrl.value = fileBaseUrl + response.filePath;
        formData.coverImage = response.filePath; //保存相对路径到文章数据中
        console.log("上传成功", response);
    } catch (error) {
        ElMessage.error('上传失败');
    }
};

const handleRemove = () => {
    imageUrl.value = '';
    formData.coverImage = '';
};
//富文本
const handleContentChange = (data) => {
    console.log("内容变化", data);
    formData.content = data.html
}

const editorInstance = ref(null);
const handleEditorCreated = (editor) => {
    editorInstance.value = editor;
    //编辑
    if (formData.content && editor) {
        //编辑文章时，初始化富文本内容
        nextTick(() => {
            editor.setHtml(formData.content);
        });
    }
}

const btnPreview = ref(false);

//提交
const loading = ref(false);

const handleSubmit = () => {
    formRef.value.validate((valid, fields) => {
        if (valid) {
            loading.value = true;
            const submitData = {
                ...formData,
                tags: formData.tagArray.join(',') //将标签数组转换为逗号分隔的字符串
            }
            delete submitData.tagArray //删除临时的标签数组字段

            if (isEdit.value) {
                updateArticle(props.article.id, submitData).then(() => {
                    ElMessage.success('文章更新成功');
                    emit('success'); //通知父组件刷新列表
                }).finally(() => {
                    loading.value = false;
                })
            } else {
                submitData.id = businessId.value; //确保ID包含在提交数据中
                createArticle(submitData).then(() => {
                    ElMessage.success('文章创建成功');
                    emit('success'); //通知父组件刷新列表
                }).finally(() => {
                    loading.value = false;
                })
            }

        } else {
            ElMessage.error('请完善表单信息');
        }
    });
};
</script>
<style scoped>
.cover-placeholder {
    width: 100%;
    height: 150px;
    border: 1px dashed #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    cursor: pointer;
}

.cover-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}
</style>