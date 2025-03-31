<template>
  <div class="joystick-container">
    <div class="joystick-wrapper">
      <Joystick @getObj="getObj" ref="myMove" :isstart="true" :bl="bl" />
    </div>

    <div class="info-panel">
      <h3>摇杆数据</h3>
      <div class="data-display">
        <div class="data-item">
          <span class="data-label">方向:</span>
          <span class="data-value">{{ direction || "无" }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">角度:</span>
          <span class="data-value">{{ degrees }}°</span>
        </div>
        <div class="data-item">
          <span class="data-label">距离:</span>
          <span class="data-value">{{ distance }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Joystick from "@/components/Joystick/Joystick.vue";
import { ref } from "vue";

const bl = ref(200);
const myMove = ref();

const direction = ref("无");
const degrees = ref(0);
const distance = ref(0);

function getObj(res: any) {
  direction.value = getDirectionName(res.angle);
  degrees.value = Math.round(res.degrees) || 0;
  distance.value = Math.round(res.distance * 100) / 100 || 0;
}

function getDirectionName(dir: string): string {
  const directions: Record<string, string> = {
    up: "上",
    down: "下",
    left: "左",
    right: "右",
    up_left: "左上",
    up_right: "右上",
    down_left: "左下",
    down_right: "右下",
  };
  return directions[dir] || dir;
}
</script>

<style lang="scss" scoped>
.joystick-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 20px;
  box-sizing: border-box;
}

.joystick-wrapper {
  width: 300px;
  height: 300px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-panel {
  width: 100%;
  max-width: 400px;
  background: rgba(44, 62, 80, 0.8);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: #ecf0f1;

  h3 {
    color: #f1c40f;
    text-align: center;
    margin: 0 0 20px;
    font-size: 20px;
  }
}

.data-display {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(52, 73, 94, 0.5);
  border-radius: 8px;
}

.data-label {
  font-weight: bold;
  color: #f1c40f;
}

.data-value {
  font-family: monospace;
  font-size: 16px;
}

@media (max-width: 500px) {
  .data-display {
    grid-template-columns: 1fr;
  }

  .joystick-wrapper {
    width: 250px;
    height: 250px;
  }
}
</style>
