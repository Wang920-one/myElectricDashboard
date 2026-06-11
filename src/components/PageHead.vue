<template>
    <div class="page-head">
        <p class="page-title">{{ props.title }}</p>
        <div class="action-btn">
            <slot name="buttons"></slot>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "页面标题"
    }
});
</script>
<style lang="scss" scoped>
.page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 10px 0;;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
    .page-title {
        font-size: 18px;
        font-weight: bold;
    }
}
</style>