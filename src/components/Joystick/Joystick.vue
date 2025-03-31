<template>
  <div
    style="position: relative"
    :style="{ width: opts.josize + 'px', height: opts.josize + 'px' }"
  >
    <div
      class="canvasBox"
      style="width: 100%; height: 100%; bottom: 0; left: 0"
    >
      <canvas
        class="moveCanvas"
        :width="opts.josize"
        :height="opts.josize"
        :style="{ width: opts.josize + 'px', height: opts.josize + 'px' }"
      ></canvas>
    </div>
    <div
      class="move-dom"
      :class="{ active: opts.isStart }"
      @touchstart="moverStart"
      @touchmove="moveMove"
      @touchend="moveEnd"
      @touchcancel="moveEnd"
      @mousemove="moveMove"
      @mousedown="moverStart"
      @mouseup="moveEnd"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, nextTick } from "vue";
import jPlayBg from "@/assets/images/j_play.png"; // 自动处理路径
import jBg from "@/assets/images/j.png"; // 自动处理路径
const opts = reactive<any>({
  j_bg: "", // 摇杆背景
  j_play_bg: "", // 摇杆按钮图片
  isStart: false, // 是否触摸摇杆
  top: 0, // 操作杆初始位置 top
  left: 0, // 操作杆初始位置 left
  jx: 0,
  jy: 0,
  josize: 140,
  josize_bg: 120,
  jisize: 75,
  centerX: 75,
  centerY: 75,
  effectiveFinger: 0,
  jc: null, // 画板
});
const props = withDefaults(
  defineProps<{
    bl: number;
    isstart?: boolean;
  }>(),
  {
    bl: 100,
    isstart: true,
  }
);
const emit = defineEmits<{
  (e: "getObj", params: any): void;
}>();
watch(
  () => props.isstart,
  (val) => {
    if (val) {
      initFun();
    }
  },
  { immediate: true } // 可选：立即触发
);

watch(
  () => opts.jx,
  (val) => {
    if (val) {
      let distance = Math.ceil(
        Math.sqrt(opts.jx * opts.jx + opts.jy * opts.jy)
      );
      // 判断方位信息
      let obj = {
        angle: "", // 方向
        size: opts.josize_bg,
        distance: distance, // 移动距离
        degrees: getDegrees(opts.jx, opts.jy),
      };
      if (val > 0) {
        // 操作杆在右上、右下
        if (Math.abs(opts.jy) > Math.abs(opts.jx)) {
          // 右边
          if (opts.jy > 0) {
            obj.angle = "down";
          } else {
            obj.angle = "up";
          }
        } else {
          // 正右方
          obj.angle = "right";
        }
      } else if (val <= 0) {
        // 操作杆在左上、左下
        if (Math.abs(opts.jy) > Math.abs(opts.jx)) {
          // 左边
          if (opts.jy > 0) {
            obj.angle = "down";
          } else {
            obj.angle = "up";
          }
        } else {
          // 正左方
          obj.angle = "left";
        }
      }
      throttle(emit("getObj", obj), 100);
    }
  }
);
// 角度转换
function getDegrees(x: number, y: number) {
  // 1. 计算弧度
  const radians = Math.atan2(y, x); // 结果范围：-π 到 π

  // 2. 转换为角度（0°~360°）
  let degrees = radians * (180 / Math.PI);
  if (degrees < 0) degrees += 360; // 将负角度转为正角度
  return degrees.toFixed(4);
}
// 节流函数
function throttle(func: any, wait: number): Function {
  let timeout: ReturnType<typeof setTimeout> | null | undefined;
  return function (
    this: ThisParameterType<any>,
    ...args: Parameters<any>
  ): void {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
// 初始化
async function initFun() {
  // 确保DOM已挂载
  await nextTick();
  console.log("初始化");
  // 加载图片资源，加载后绘制图片
  // opts.j_play_bg = await getImageAsync(
  //   "https://weimaqi.iscan.top/marketing/img/j_play.png"
  // );
  // opts.j_bg = await getImageAsync(
  //   "https://weimaqi.iscan.top/marketing/img/j.png"
  // );

  opts.j_play_bg = await getImageAsync(jPlayBg);
  opts.j_bg = await getImageAsync(jBg);

  // 初始化尺寸
  let size = Math.floor(props.bl);
  opts.josize = size;
  // 获取canvas ctx实例
  if (!opts.jc) {
    const canvas = document.querySelector(
      ".moveCanvas"
    ) as HTMLCanvasElement | null;
    opts.jc = canvas?.getContext("2d");
  }
  // 初始化摇杆信息（摇杆背景，摇杆移动按钮，摇杆中心位置等）
  await initCanvasRect();

  requestAnimationFrame(move); //开始绘图
}
// 获取canvas的位置
async function initCanvasRect() {
  const rect = await getElSize(".canvasBox");
  opts.top = rect.top || 0;
  opts.left = rect.left || 0;
  opts.jisize = opts.josize * 0.35;
  opts.josize_bg = opts.josize * 0.8;
  opts.centerX = opts.josize / 2; //摇杆中心x坐标
  opts.centerY = opts.josize / 2; //摇杆中心y坐标
  return Promise.resolve();
}
// 开始绘制
//绘图函数（绘制图形的时候就是用户观察到摇杆动了，所以取名是move）
function move() {
  opts.jc?.clearRect(
    opts.centerX - opts.josize / 2,
    opts.centerY - opts.josize / 2,
    opts.josize,
    opts.josize
  ); //清空画板

  opts.jc?.drawImage(
    opts.j_bg,
    (opts.josize - opts.josize_bg) / 2,
    (opts.josize - opts.josize_bg) / 2,
    opts.josize_bg,
    opts.josize_bg
  ); //画底座
  opts.jc?.drawImage(
    opts.j_play_bg,
    opts.centerX - opts.jisize / 2 + opts.jx,
    opts.centerY - opts.jisize / 2 + opts.jy,
    opts.jisize,
    opts.jisize
  ); //画摇杆头
  requestAnimationFrame(move); //开始绘图
}
// 获取元素信息
function getElSize(el: any): Promise<any> {
  return new Promise((resolve) => {
    const element = document.querySelector(el);
    const rect = element.getBoundingClientRect();
    resolve(rect);
  });
}
// 异步加载图片
function getImageAsync(url: string | undefined): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!url) return reject();
    let image = new Image();
    image.src = url;
    image.onload = () => {
      resolve(image);
    };
  });
}
// 触摸开始
async function moverStart(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  await initCanvasRect();
  let cX =
    "touches" in event
      ? event.touches[opts.effectiveFinger].clientX
      : event.clientX;
  let cY =
    "touches" in event
      ? event.touches[opts.effectiveFinger].clientY
      : event.clientY;
  let clientX = cX - opts.left;
  let clientY = cY - opts.top;
  if (
    clientX > 0 &&
    clientX < opts.josize &&
    clientY > 0 &&
    clientY < opts.josize
  ) {
    opts.isStart = true;
  } else {
    // 不符合条件
    // console.log('不符合条件不能移动',clientX,clientY,opts.josize);
    return;
  }
  //是否触摸点在摇杆上
  if (
    Math.sqrt(
      Math.pow(clientX - opts.centerX, 2) + Math.pow(clientY - opts.centerY, 2)
    ) <=
    opts.josize / 2 - opts.jisize / 2
  ) {
    opts.jx = clientX - opts.centerX;
    opts.jy = clientY - opts.centerY;
  }
  //否则计算摇杆最接近的位置
  else {
    var x = clientX,
      y = clientY,
      r = opts.josize / 2 - opts.jisize / 2;
    var ans = getPoint(
      opts.centerX,
      opts.centerY,
      r,
      opts.centerX,
      opts.centerY,
      x,
      y
    );
    //圆与直线有两个交点，计算出离手指最近的交点
    if (
      Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) <
      Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))
    ) {
      opts.jx = ans[0] - opts.centerX;
      opts.jy = ans[1] - opts.centerY;
    } else {
      opts.jx = ans[2] - opts.centerX;
      opts.jy = ans[3] - opts.centerY;
    }
  }
}
// 移动中
function moveMove(event: TouchEvent | MouseEvent) {
  if (!opts.isStart) {
    // 首次触摸点未在操作杆上 停止运行
    return;
  }
  let cX =
    "touches" in event
      ? event.touches[opts.effectiveFinger].clientX
      : event.clientX;
  let cY =
    "touches" in event
      ? event.touches[opts.effectiveFinger].clientY
      : event.clientY;
  let clientX = cX - opts.left;
  let clientY = cY - opts.top;
  //是否触摸点在摇杆上
  if (
    Math.sqrt(
      Math.pow(clientX - opts.centerX, 2) + Math.pow(clientY - opts.centerY, 2)
    ) <=
    opts.josize / 2 - opts.jisize / 2
  ) {
    opts.jx = clientX - opts.centerX;
    opts.jy = clientY - opts.centerY;
  }
  //否则计算摇杆最接近的位置
  else {
    var x = clientX,
      y = clientY,
      r = opts.josize / 2 - opts.jisize / 2;

    var ans = getPoint(
      opts.centerX,
      opts.centerY,
      r,
      opts.centerX,
      opts.centerY,
      x,
      y
    );
    //圆与直线有两个交点，计算出离手指最近的交点
    if (
      Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) <
      Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))
    ) {
      opts.jx = ans[0] - opts.centerX;
      opts.jy = ans[1] - opts.centerY;
    } else {
      opts.jx = ans[2] - opts.centerX;
      opts.jy = ans[3] - opts.centerY;
    }
  }
}
// 触摸结束
function moveEnd() {
  //若手指离开,那就把内摇杆放中间
  opts.jx = 0;
  opts.jy = 0;
  opts.isStart = false;
  emit("getObj", {
    isStop: 1,
  });
}
//计算圆于直线的交点
function getPoint(
  cx: number,
  cy: number,
  r: number,
  stx: number,
  sty: number,
  edx: number,
  edy: number
) {
  var k = (edy - sty) / (edx - stx); // 触碰位置 xy 与圆半径的差之后的比例 也就是圆心距离手指触碰y与x的比例
  var b = edy - k * edx; // 手指触摸的位置 减去 比例 乘以手指触摸的x位置
  var x1, y1, x2, y2; //定义坐标点
  var c = cx * cx + (b - cy) * (b - cy) - r * r; // 圆心坐标相乘 加上
  var a = 1 + k * k;
  var b1 = 2 * cx - 2 * k * (b - cy);
  var tmp = Math.sqrt(b1 * b1 - 4 * a * c);
  x1 = (b1 + tmp) / (2 * a);
  y1 = k * x1 + b;
  x2 = (b1 - tmp) / (2 * a);
  y2 = k * x2 + b;
  return [x1, y1, x2, y2];
}
</script>
<style lang="scss" scoped>
.move-dom {
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
}
.move-dom.active {
  width: 100vw;
  height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
