<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button icon="Expand" @click="handleCollapse" />
      <h1 class="navbar-title">{{ route.meta.title }}</h1>
    </div>
    <div class="flex-box">
      <div class="flex-box">
        <el-avatar style="margin-right: 10px"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            管理员<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout"> 退出登录 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAdminStore } from "@/stores/admin";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import { logout } from "@/api/admin";

const route = useRoute()

const router = useRouter();

const handleCommand = (command) => {
  console.log(command);
  if (command === 'logout') {
    //处理登出逻辑
    ElMessageBox.confirm('确认退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      //确认退出登录
      logout().then(() => {
        //清除缓存
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        //跳转到登录页面
        router.push('/auth/login')
      })
    })
  }
};

const handleCollapse = () => {
  useAdminStore().toggleCollapse();
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;

  .navbar-title {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
  }

  .avatar-box {
    margin-right: 10px;
  }
}

.flex-box,
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>