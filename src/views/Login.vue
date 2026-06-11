<template>
  <div class="container">
    <div class="back-home">
      <el-button link @click="router.push('/')"> 返回首页 </el-button>
    </div>
    <div class="title">
      <div class="title-text">
        <h2>登录</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名或邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-button class="btn" size="large" type="primary" @click="handleLogin(ruleFormRef)">登录</el-button>
      </el-form>
      <div class="register-link">
        <p>没有账号？ <router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { login } from "@/api/admin";
import { da } from "element-plus/es/locales.mjs";
import { useRouter } from "vue-router";

const router = useRouter();
const ruleFormRef = ref();
const formData = reactive({
  password: "",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};


const handleLogin = async (formEl) => {
  // 登录逻辑
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 这里可以调用登录接口
      console.log("登录成功", fields);
      login(formData).then(data=>{
        //判断token是否存在
        if(!data.token){
          return console.error('登录失败')
        }
        //登录成果，保存token和用户信息
        localStorage.setItem('token',data.token)
        localStorage.setItem('userInfo',JSON.stringify(data.userInfo))

        //根据用户角色决定跳转的路径
        if(data.userInfo.userType === 2){
          router.push('/back/dashboard')
        }else{
          
        }
      })
    } else {
      console.log("表单验证失败");
      return false;
    }
  });
};

</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative !important;

  .back-home {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .title {
    text-align: center;
    margin-bottom: 30px;

    .title-text {
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
        color: #666;
      }
    }
  }

  .form-container {
    width: 400px;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    background-color: rgba(240, 240, 240, 0.479);

    .btn {
      margin-top: 20px;
      width: 100%;
      background-color: #8cbdcb !important;
      border: 1px solid #79b8c9 !important;
    }

    .footer {
      padding: 30px;
      text-align: center;
    }

    .register-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
    }
  }
}
</style>