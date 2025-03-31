<template>
  <div class="rank-board">
    <h3>分数排行</h3>
    <div class="rank-list">
      <div
        v-for="(rank, index) in rankData"
        :key="index"
        :class="['rank-item', `rank-${index + 1}`]"
      >
        <div class="rank-number">{{ index + 1 }}</div>
        <div class="rank-info">
          <div class="player-name">{{ rank.name }}</div>
          <div class="score">{{ rank.score }}分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Rank } from "@/types/tetrisTypes";

export default defineComponent({
  props: {
    rankData: {
      type: Array as PropType<Rank[]>,
      default: () => [],
    },
  },
});
</script>

<style lang="scss" scoped>
.rank-board {
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  background: rgba(44, 62, 80, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-height: 450px;
  overflow: auto;

  h3 {
    color: #f1c40f;
    font-size: 18px;
    text-align: center;
    margin: 0 0 15px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    letter-spacing: 1px;
  }
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: rgba(52, 73, 94, 0.6);
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateX(5px);
    box-shadow: -3px 3px 8px rgba(0, 0, 0, 0.2);
  }

  &.rank-1 {
    background: linear-gradient(
      135deg,
      rgba(255, 215, 0, 0.2),
      rgba(255, 215, 0, 0.1)
    );
    border: 1px solid rgba(255, 215, 0, 0.3);
  }

  &.rank-2 {
    background: linear-gradient(
      137deg,
      rgb(251 167 167 / 20%),
      rgb(255 0 0 / 10%)
    );
    border: 1px solid rgba(192, 192, 192, 0.3);
  }

  &.rank-3 {
    background: linear-gradient(
      135deg,
      rgba(205, 127, 50, 0.2),
      rgba(205, 127, 50, 0.1)
    );
    border: 1px solid rgba(205, 127, 50, 0.3);
  }
}

.rank-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #34495e;
  border-radius: 50%;
  margin-right: 12px;
  font-weight: bold;
  font-size: 14px;
  color: #ecf0f1;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);

  .rank-1 & {
    background: #f1c40f;
    color: #2c3e50;
  }

  .rank-2 & {
    background: #bdc3c7;
    color: #2c3e50;
  }

  .rank-3 & {
    background: #d35400;
    color: #ecf0f1;
  }
}

.rank-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-name {
  color: #ecf0f1;
  font-weight: 500;
  font-size: 14px;
}

.score {
  color: #3498db;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
}

@keyframes scoreUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.rank-item.new-score {
  animation: scoreUpdate 0.5s ease-out;
}
</style>
