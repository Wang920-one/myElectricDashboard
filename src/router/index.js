import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";
import { timeUnits } from "element-plus";
import AuthLayout from "@/components/AuthLayout.vue";
import FrontendLayout from "@/components/FrontendLayout.vue";
import { el } from "element-plus/es/locales.mjs";

//路由的配置
const backendRoutes = [
  {
    path: "/back",
    redirect: "/back/dashboard",
    name: "Home",
    component: BackendLayout,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          title: "数据分析",
          icon: "pie-chart",
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/Knowledge.vue"),
        meta: {
          title: "知识管理",
          icon: "ChatLineSquare",
        },
      },
      {
        path: "consulations",
        component: () => import("@/views/Consulations.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        path: "emotional",
        component: () => import("@/views/Emotional.vue"),
        meta: {
          title: "情绪日志",
          icon: "User",
        },
      },
    ],
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        component: () => import("@/views/Login.vue"),
        meta: {
          title: "登录",
          icon: "Login",
        },
      },
      {
        path: "register",
        component: () => import("@/views/Register.vue"),
        meta: {
          title: "注册",
          icon: "User",
        },
      },
    ],
  }
];

const frontendRoutes = [
  {
    path: "/",
    component: FrontendLayout,
    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes],
});

//路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  //当前用户是否登录
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //如果是后台用户
    if (userInfo.userType === "2" || userInfo.userType === 2) {
      if (to.path.startsWith("/back")) {
        next();
      } else {
        next("/back/dashboard");
      }
    } else if (userInfo.userType === "1" || userInfo.userType === 1) {
    }
  } else {
    if (to.path.startsWith("/back")) {
      //如果是访问后台页面，那么跳转登录页
      next("/auth/login");
    } else {
      next();
    }
  }
});

export default router;
