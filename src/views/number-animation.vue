<template>
  <div class="animation-container">
    <h1 class="title">
      <span
        class="title-char"
        v-for="(char, index) in titleChars"
        :key="index"
        :style="charStyle(index)"
      >
        {{ char }}
      </span>
    </h1>

    <div class="animation-grid">
      <div class="animation-card card-1">
        <h2>💰 货币动画</h2>
        <div class="animation-display">
          <div class="number-display">{{ formattedCurrency }}</div>
        </div>
        <button class="control-btn neon-btn" @click="startCurrencyAnimation">
          <span class="neon-text">开始动画</span>
        </button>
      </div>

      <div class="animation-card card-2">
        <h2>📈 数字增长</h2>
        <div class="animation-display">
          <div class="number-display">{{ formattedNum }}</div>
        </div>
        <div class="controls">
          <button
            class="control-btn neon-btn"
            @click="startAnimation"
            :disabled="isAnimating && !isPaused"
          >
            <span class="neon-text">开始</span>
          </button>
          <button
            class="control-btn neon-btn pause"
            @click="pauseAnimation"
            :disabled="!isAnimating || isPaused"
          >
            <span class="neon-text">暂停</span>
          </button>
          <button
            class="control-btn neon-btn resume"
            @click="resumeAnimation"
            :disabled="!isPaused"
          >
            <span class="neon-text">继续</span>
          </button>
        </div>
      </div>

      <div class="animation-card card-3">
        <h2>📊 百分比</h2>
        <div class="animation-display">
          <div class="number-display">{{ formattedPercentage }}</div>
        </div>
        <button class="control-btn neon-btn" @click="startPercentageAnimation">
          <span class="neon-text">运行动画</span>
        </button>
      </div>
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

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const title = "数字动画实验室";
const titleChars = title.split("");
const charStyle = (index: number) => ({
  color: `hsl(${(index * 30 + Date.now() / 50) % 360}, 100%, 70%)`,
  textShadow: `0 0 10px hsl(${
    (index * 30 + Date.now() / 50) % 360
  }, 100%, 50%)`,
});

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

const num = ref(0);
const isAnimating = ref(false);
const isPaused = ref(false);
let animationId = 0;
let startTime = 0;
let pausedTime = 0;
let progress = 0;

const config = ref({
  from: 0,
  to: 3000,
  duration: 1000,
});

const formattedNum = computed(() => {
  return num.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

function startAnimation() {
  if (isAnimating.value) return;

  isAnimating.value = true;
  isPaused.value = false;
  startTime = Date.now() - (pausedTime || 0);
  pausedTime = 0;

  cancelAnimationFrame(animationId);
  animate();
}

function animate() {
  const elapsed = Date.now() - startTime;
  progress = Math.min(elapsed / config.value.duration, 1);

  num.value =
    config.value.from +
    (config.value.to - config.value.from) * easeOutQuad(progress);

  if (progress < 1) {
    animationId = requestAnimationFrame(animate);
  } else {
    isAnimating.value = false;
  }
}

function pauseAnimation() {
  if (!isAnimating.value) return;

  cancelAnimationFrame(animationId);
  isAnimating.value = false;
  isPaused.value = true;
  pausedTime = Date.now() - startTime;
}

function resumeAnimation() {
  if (!isPaused.value) return;
  startAnimation();
}

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

const currency = ref(0);
const formattedCurrency = computed(() => {
  return currency.value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
});

function startCurrencyAnimation() {
  animateValue({
    from: 100,
    to: 9999.99,
    duration: 1500,
    onUpdate: (val) => (currency.value = val),
    easing: easeInOutCubic,
  });
}

const percentage = ref(0);
const formattedPercentage = computed(() => {
  return percentage.value.toFixed(1);
});

function startPercentageAnimation() {
  animateValue({
    from: 0,
    to: 100,
    duration: 2000,
    onUpdate: (val) => (percentage.value = val),
    easing: easeInOutBack,
  });
}

function animateValue({
  from,
  to,
  duration,
  onUpdate,
  easing = (t) => t,
}: {
  from: number;
  to: number;
  duration: number;
  onUpdate: (value: number) => void;
  easing?: (t: number) => number;
}) {
  const start = Date.now();
  let animId: number;

  function update() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const value = from + (to - from) * easedProgress;

    onUpdate(value);

    if (progress < 1) {
      animId = requestAnimationFrame(update);
    }
  }

  update();
  return () => cancelAnimationFrame(animId);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutBack(t: number): number {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
}
</script>

<style lang="scss" scoped>
.animation-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  position: relative;
  overflow: hidden;
}

.title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 3rem;
  font-weight: bold;
  position: relative;
  z-index: 2;

  &-char {
    display: inline-block;
    transition: all 0.3s ease;
    transform: translateY(0);
    animation: float 3s ease-in-out infinite;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        animation-delay: $i * 0.1s;
      }
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.animation-card {
  background: rgba(44, 62, 80, 0.7);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  }

  h2 {
    color: #f1c40f;
    font-size: 1.8rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
  }
}

.card-1 {
  border-top: 4px solid #e74c3c;
}
.card-2 {
  border-top: 4px solid #2ecc71;
}
.card-3 {
  border-top: 4px solid #3498db;
}

.animation-display {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  margin: 2rem 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: -10px;
    border-radius: 16px;
    background: linear-gradient(
      45deg,
      rgba(231, 76, 60, 0.3),
      rgba(46, 204, 113, 0.3),
      rgba(52, 152, 219, 0.3)
    );
    z-index: -1;
    filter: blur(20px);
  }
}

.number-display {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  font-family: "Courier New", monospace;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.neon-btn {
  position: relative;
  padding: 0.8rem 1.8rem;
  border: none;
  background: rgba(0, 0, 0, 0.5);
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;

    .neon-text {
      text-shadow: none !important;
    }
  }

  &.pause .neon-text {
    color: #f39c12;
  }
  &.resume .neon-text {
    color: #3498db;
  }
}

.neon-text {
  color: #2ecc71;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s;
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
  }
}

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

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  .animation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
