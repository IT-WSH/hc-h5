<template>
  <div class="score-board">
    <h3>当前分数</h3>
    <div class="score-value">{{ score }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    score: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
});
</script>

<style lang="scss" scoped>
.score-board {
  background-color: #34495e;
  border-radius: 8px;
  padding: 15px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  h3 {
    margin: 0 0 10px 0;
    color: #f1c40f;
    font-size: 18px;
  }

  .score-value {
    font-size: 24px;
    font-weight: bold;
    color: #2ecc71;
  }
}
</style>
