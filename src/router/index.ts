// router/index.ts
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home.vue'),
    meta: {
      keepAlive: false, //需要缓存
      title: 'hc',
      requiresAuth: false, // 是否需要登录授权
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: {
      keepAlive: false, //需要缓存
      title: '登录',
      requiresAuth: false, // 是否需要登录授权
    },
  },

  {
    path: '/flip',
    name: 'Flip',
    component: () => import('@/views/flip.vue'),
    meta: {
      keepAlive: false, //需要缓存
      title: 'FLIP动画',
      requiresAuth: false, // 是否需要登录授权
    },
  },

  {
    path: '/game',
    name: 'Game',
    component: () => import('@/views/game.vue'),
    meta: {
      keepAlive: false, //需要缓存
      title: '游戏分组',
      requiresAuth: false, // 是否需要登录授权
    },
  },

  {
    path: '/circular-btn',
    name: 'CircularBtn',
    component: () => import('@/views/circular-btn.vue'),
    meta: {
      keepAlive: false, //需要缓存
      title: '游戏分组',
      requiresAuth: false, // 是否需要登录授权
    },
  },
  {
    path: '/play',
    name: 'Play',
    component: () => import('@/views/play.vue'),
    meta: {
      keepAlive: false, //需要缓存
      title: '俄罗斯方块',
      requiresAuth: false, // 是否需要登录授权
    },
  },
  {
    path: '/joystick',
    name: 'Joystick',
    component: () => import('@/views/joystick.vue'),
    meta: {
      keepAlive: false, //需要缓存
      title: '虚拟摇杆',
      requiresAuth: false, // 是否需要登录授权
    },
  },
  {
    path: '/number-animation',
    name: 'NumberAnimation',
    component: () => import('@/views/number-animation.vue'),
    meta: {
      keepAlive: false, //需要缓存
      title: '数字动画',
      requiresAuth: false, // 是否需要登录授权
    },
  }

]

const router = createRouter({
  history: createWebHashHistory('/app'),
  routes
})

// 路由拦截
router.beforeEach((to: any, from: any, next: any) => {
  console.log(from);

  const token = localStorage.getItem('token')
  // 设置标题
  document.title = (to.meta.title || 'HC') as string
  // 监听路由权限（需要登录，没登录跳转登录）
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router