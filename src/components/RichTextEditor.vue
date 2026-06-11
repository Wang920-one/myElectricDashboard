<template>
    <div class="rich-text-editor">
        <!-- 富文本编辑器 -->
        <div class="editor-container">
            <WangToolbar class="editor-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
            <WangEditor class="wang-editor" v-model="content" :defaultConfig="editorConfig" mode="default"
                @onCreated="handleEditorCreated" @onChange="handleEditorChange" @onDestroy="handleEditorDestroy" />
        </div>

        <!-- 字数统计 -->
        <div v-if="showWordCount" class="editor-footer">
            <div class="word-count">
                <span class="count-text">{{ currentCharCount }} / {{ maxCharCount }}</span>
                <div class="progress-bar">
                    <div class="progress-fill"
                        :style="{ width: Math.min((currentCharCount / maxCharCount) * 100, 100) + '%' }"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, computed, onBeforeUnmount, shallowRef, watch } from 'vue';
import { Editor as WangEditor, Toolbar as WangToolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css';
// import { ELMessage } from 'element-plus';

//Props
const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '请输入内容...',
    },
    maxCharCount: {
        type: Number,
        default: 2000,
    },
    showWordCount: {
        type: Boolean,
        default: true,
    },
    showSecurityTip: {
        type: Boolean,
        default: true,
    },
    toolbarKeys: {
        type: Array,
        default: () => [
            // 菜单 key
            'headerSelect',
            // 分割线
            '|',
            // 菜单 key
            'bold',
            'italic',
            // 菜单组，包含多个菜单
            {
                key: 'group-more-style', // 必填，要以 group 开头
                title: '更多样式', // 必填
                iconSvg: '<svg>....</svg>', // 可选
                menuKeys: ['through', 'code', 'clearStyle'], // 下级菜单 key ，必填
            },
            // 继续配置其他菜单...
        ],
    },
    minHeight: {
        type: String,
        default: '300px',
    },
});

//Emits
const emit = defineEmits(['update:modelValue', 'change', 'created']);

//响应式数据
const currentCharCount = ref(0);
const editorRef = shallowRef(null);

//计算属性
const content = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

//编辑器配置
const editorConfig = reactive({
    placeholder: props.placeholder,
    MENU_CONF: {
        fontSize: {
            fontSizeList: [
                '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px', '38px', '40px'
            ]
        },
        fontFamily: {
            fontFamilyList: [
                { name: '默认', value: '' },
                { name: '宋体', value: 'SimSun, Songti SC, NSimSun, STSong, "Microsoft YaHei", Helvetica, Arial, sans-serif' },
                { name: '黑体', value: 'SimHei, Heiti SC, NSimHei, "Microsoft YaHei", Helvetica, Arial, sans-serif' },
                { name: '微软雅黑', value: '"Microsoft YaHei", Helvetica, Arial, sans-serif' },
                { name: '楷体', value: 'KaiTi, "Microsoft YaHei", Helvetica, Arial, sans-serif' },
                { name: '仿宋', value: 'FangSong, "Microsoft YaHei", Helvetica, Arial, sans-serif' },
                { name: '华文行楷', value: '"STXingkai", "Microsoft YaHei", Helvetica, Arial, sans-serif' },
                { name: '华文隶书', value: '"STLiti", "Microsoft YaHei", Helvetica, Arial, sans-serif' },
                { name: '华文新魏', value: '"STXinwei", "Microsoft YaHei", Helvetica, Arial, sans-serif' },
                { name: '华文彩云', value: '"STCaiyun", "Microsoft YaHei", Helvetica, Arial, sans-serif' },
            ]
        }
    }
})

const editorContent = reactive({
});

// 工具栏配置
const toolbarConfig = reactive({
    toolbarKeys: props.toolbarKeys,
});

//方法
const handleEditorCreated = (editor) => {
    editorRef.value = editor;

    //初始化字数统计
    updateCharCount();

    //调试信息-检查字体配置
    console.log('当前字体配置:', editor.getConfig());
    console.log('编辑器实例', editor);

    //检查字体菜单
    const menus = editor.getAllMenuKeys();
    console.log('当前菜单项:', menus);

    if (menus.includes('fontFamily')) {
        console.log('字体菜单已启用');
    } else {
        console.warn('字体菜单未启用');
    }

    //触发创建事件
    emit('created', editor);

    console.log('富文本编辑器已创建');
};

const handleEditorChange = (editor) => {
    updateCharCount();

    //触发变更事件
    emit('change', {
        html: editor.getHtml(),
        text: editor.getText(),
    });
};

const handleEditorDestroy = (editor) => {
    editorRef.value = null;
    console.log('富文本编辑器已销毁');
};

const updateCharCount = () => {
    if (!editorRef.value) {
        currentCharCount.value = 0;
        return;
    }
    const text = editorRef.value.getText();
    currentCharCount.value = text.length;
};
</script>

<style lang="scss" scoped>
.rich-text-editor {
    width: 100%;

    .editor-container {
        border: 1px solid #ccc;
        border-radius: 4px;
        // overflow: hidden;

        .editor-toolbar {
            border-bottom: 1px solid #ccc;
            background-color: #f5f5f5;
        }

        .wang-editor {
            min-height: v-bind(minHeight);
            overflow-y: hidden;
        }
    }

    .editor-footer {
        margin-top: 8px;
        display: flex;
        justify-content: flex-end;

        .word-count {
            display: flex;
            align-items: center;

            .count-text {
                font-size: 12px;
                color: #606266;
                margin-right: 8px;
            }

            .progress-bar {
                width: 100px;
                height: 4px;
                background-color: #e4e7ed;
                border-radius: 2px;
                overflow: hidden;

                .progress-fill {
                    height: 100%;
                    background-color: #409eff;
                    transition: width 0.3s ease;
                }
            }
        }
    }
}
</style>