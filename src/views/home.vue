<template>
  <div class="hc">
    <div class="hc-title">
      <span
        class="title-char"
        v-for="(char, index) in titleChars"
        :key="index"
        :style="charStyle(index)"
      >
        {{ char }}
      </span>
    </div>
    <div class="hc-list">
      <div
        class="list-li"
        v-for="(item, index) in opts.funcList"
        :key="index"
        @click="openPage(item.path)"
        :style="cardStyle(index)"
      >
        <div class="li-icon"></div>
        <div class="li-tit">{{ item.title }}</div>
        <div class="li-msg">{{ item.message }}</div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="neon-btn" @click="openPage('/login')">
        <span class="neon-text">跳转登录</span>
      </button>
      <button class="neon-btn" @click="openDialog">
        <span class="neon-text">打开弹窗</span>
      </button>
    </div>

    <div class="particles">
      <div
        class="particle"
        v-for="(particle, index) in particles"
        :key="index"
        :style="particle.style"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Dialog } from "@/components/Dialog";

const router = useRouter();

// Title animation
const titleText = "HC实验室";
const titleChars = titleText.split("");
const charStyle = (index: number) => ({
  color: `hsl(${(index * 120 + Date.now() / 50) % 360}, 100%, 70%)`,
  textShadow: `0 0 10px hsl(${
    (index * 120 + Date.now() / 50) % 360
  }, 100%, 50%)`,
  display: "inline-block",
  transform: `rotate(${Math.sin(Date.now() / 500 + index) * 5}deg)`,
});

// Card colors
const cardStyle = (index: number) => ({
  "--card-color": `hsl(${(index * 60) % 360}, 80%, 60%)`,
  "--card-light": `hsl(${(index * 60) % 360}, 100%, 70%)`,
});

// Particle background
const particles = ref<Array<{ style: any }>>([]);
onMounted(() => {
  for (let i = 0; i < 30; i++) {
    particles.value.push({
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        background: `hsl(${Math.random() * 360}, 100%, 70%)`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.3,
      },
    });
  }
});

// Rest of the original script remains unchanged
let title = ref("HC");

let opts = reactive({
  bannerList: [],
  funcList: [
    {
      title: "英雄联盟自定义随机分组",
      message: "自定义选择游戏在线人数，进行两队随机分组",
      path: "/game",
    },
    {
      title: "FLIP动画",
      message: "利用FLIP动画原理实现列表位置移动画",
      path: "/flip",
    },
    {
      title: "圆形控制按钮（scss实现）",
      message: "每个按钮图标均匀分布在圆形的边上",
      path: "/circular-btn",
    },
    {
      title: "俄罗斯方块",
      message: "使用AI实现的俄罗斯方块游戏",
      path: "/play",
    },
    {
      title: "虚拟摇杆",
      message: "基于canvas绘制的虚拟摇杆组件",
      path: "/joystick",
    },
    {
      title: "form->to 数字变化动画封装",
      message:
        "封装form值变换到to值的动画函数，实现封装一个函数，调用监听值的变化更新视图",
      path: "/number-animation",
    },
    {
      title: "粒子时钟",
      message: "基于canvas绘制例子时钟",
      path: "/",
    },
    {
      title: "PC大屏",
      message: "DataV实现大屏",
      path: "/",
    },
  ],
  userInfo: {},
});

function openPage(path: string | undefined) {
  if (!path) throw "无效访问地址";
  router.push({ path: path });
}

async function openDialog() {
  const res = await Dialog.show({
    title: "温馨提示",
    content: "您正在查看这个弹窗，这是弹窗的内容",
    showCancel: true,
  });
  setTimeout(res.close, 3000);
}
</script>

<style lang="scss" scoped>
.hc {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  position: relative;
  overflow: hidden;

  .hc-title {
    text-align: center;
    font-size: 4rem;
    font-weight: 800;
    line-height: 6rem;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;

    .title-char {
      display: inline-block;
      animation: float 3s ease-in-out infinite;

      @for $i from 1 through 10 {
        &:nth-child(#{$i}) {
          animation-delay: $i * 0.1s;
        }
      }
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(5deg);
    }
  }

  .hc-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    padding: 2rem 0;
    box-sizing: border-box;
    position: relative;
    z-index: 2;

    .list-li {
      flex: 1 1 300px;
      max-width: 400px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          to bottom right,
          var(--card-color),
          var(--card-light)
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
      }

      &:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);

        &::before {
          opacity: 0.3;
        }

        .li-tit {
          color: white;
          text-shadow: 0 0 10px var(--card-light);
        }

        .li-msg {
          color: rgba(255, 255, 255, 0.9);
        }
      }

      .li-tit {
        font-size: 1.2rem;
        font-weight: 700;
        color: white;
        margin-bottom: 0.8rem;
        transition: all 0.3s ease;
      }

      .li-msg {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.5;
        transition: all 0.3s ease;
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
    position: relative;
    z-index: 2;

    .neon-btn {
      position: relative;
      padding: 0.8rem 2rem;
      border: none;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transition: all 0.5s;
      }

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

        &::before {
          left: 100%;
        }

        .neon-text {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
        }
      }

      .neon-text {
        color: #2ecc71;
        font-weight: bold;
        font-size: 1rem;
        transition: all 0.3s;
      }

      &:nth-child(2) .neon-text {
        color: #3498db;
      }
    }
  }

  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;

    .particle {
      position: absolute;
      border-radius: 50%;
      filter: blur(2px);
      animation: float-particle 15s infinite linear;

      @keyframes float-particle {
        0% {
          transform: translateY(0) translateX(0);
        }
        50% {
          transform: translateY(-100px) translateX(100px);
        }
        100% {
          transform: translateY(0) translateX(0);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .hc {
    padding: 1rem;

    .hc-title {
      font-size: 2.5rem;
      line-height: 3.5rem;
    }

    .hc-list {
      .list-li {
        flex: 1 1 100%;
      }
    }
  }
}
</style>
