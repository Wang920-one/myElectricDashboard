import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";

// 创建axios实例
const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（已修复所有bug）
service.interceptors.response.use(
  (response) => {
    const { data } = response;

    // ======================
    // 成功：code=200
    // ======================
    if (data.code === 200 || data.code === "200") {
      return data.data; // 直接返回后台数据
    }

    // ======================
    // 登录过期：-1
    // ======================
    if (data.code === -1 || data.code === "-1") {
      ElMessage.error(data.msg || "登录已过期，请重新登录");

      // 清除缓存
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      // 跳登录页（修复 includes 语法）
      if (!response.config.url?.includes("/login")) {
        window.location.href = "/auth/login";
      }
      return Promise.reject(data.msg);
    }

    // ======================
    // 其他错误
    // ======================
    ElMessage.error(data.msg || "操作失败");
    return Promise.reject(data);
  },
  (error) => {
    // HTTP 错误（404/500/网络异常）
    ElMessage.error(error.message || "网络异常，请稍后重试");
    return Promise.reject(error);
  }
);

export default service;
