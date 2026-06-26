<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <el-menu
      default-active="2"
      class="menu-style"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <div class="brand">
        <el-image style="width: 70px; height: 50px" :src="iconUrl" alt="logo" />
        <div v-show="!isCollapse" class="info-card">
          <h1 class="brand-title">途影记</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>
      </div>
      <el-menu-item
        v-for="item in router.options.routes[0].children"
        :key="item.path"
        :index="item.path"
        @click="selectMenu"
      >
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin";
import { computed } from "vue";

const router = useRouter();

const iconUrl = new URL("@/assets/images/logo.png", import.meta.url).href;

const isCollapse = computed(() => {
  return useAdminStore().isCollapsed;
});

const selectMenu = (key) => {
  console.log("菜单被点击了", key, router.options);
  const currentRoute = router.options.routes[0];
  console.log(`${currentRoute.path}/${key.index}`);
  router.push(`${currentRoute.path}/${key.index}`);
};
</script>

<style lang="scss" scoped>
.menu-style {
  height: 100%;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  .info-card {
    .brand-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #1f2937;
    }
    .brand-subtitle {
      font-size: 14px;
      color: #6b7280;
    }
  }
}
</style>