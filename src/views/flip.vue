<template>
  <div class="flip">
    <button @click="sort">排序</button>
    <div
      class="flip-li"
      :data-id="item.id"
      v-for="(item, index) in flipList"
      :key="index"
    >
      {{ item.tit }}
      {{ item.id }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";

const flipList = ref([
  { id: "1", tit: "Javascript" },
  { id: "2", tit: "Vue3, Vite, Pinia, Vue-router" },
  { id: "3", tit: "Typescript" },
  { id: "4", tit: "React" },
  { id: "5", tit: "Android, JAVA, Kotlin " },
  { id: "6", tit: "IOS, Swift, Objective-C " },
]);
let domMap = new Map();
function getLocaltionY() {
  let topMap = new Map();
  let fiplDom = document.getElementsByClassName("flip-li");
  for (let index = 0; index < fiplDom.length; index++) {
    const element = fiplDom[index];
    const id = element.getAttribute("data-id");
    const rect = element.getBoundingClientRect();
    topMap.set(id, rect.top);
    if (domMap.values.length < fiplDom.length) domMap.set(id, element);
  }
  return topMap;
}

function sort() {
  // 重置动画属性（每次点击都需要重置一次，不重置下次点击无法执行动画，）
  resetAnimations();
  // 利用getBoundingClientRect获取变化之前的top位置
  let oldMap = getLocaltionY();
  // 将元素打乱重排
  flipList.value = flipList.value
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  nextTick(() => {
    // 获取重排后真实dom的top位置
    let newMap = getLocaltionY();
    for (const [key, value] of newMap) {
      let oldTop = oldMap.get(key);
      let oldDom = domMap.get(key);
      // 计算差异化，在元素未显示之前修改translateY，将元素恢复到变化前的位置
      let dis = oldTop - value;
      oldDom.style.transform = `translateY(${dis}px)`;
      raf(() => {
        // 添加动画，让元素过度到变化后的位置上
        oldDom.style.transition = `transform 1s`;
        oldDom.style.removeProperty("transform");
      });
    }
  });
}
function resetAnimations() {
  domMap.forEach((element) => {
    element.style.transition = "none";
    element.style.transform = "translateY(0)";
  });
}
function raf(callback: FrameRequestCallback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}
</script>
<style lang="scss" scoped>
.flip {
  width: 300px;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 20px;
  margin: 30px auto;
  position: relative;
  .flip-li {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    background: rgba(211, 46, 46, 0.3);
    border-radius: 20px;
    margin: 10px 0;
  }
}

.message {
  padding: 30px;
  box-sizing: border-box;
}
</style>
