<template>
  <div class="game-page">
    <div class="game-container">
      <div class="game-board-wrapper">
        <GameBoard
          ref="gameBoardRef"
          @scoreUpdated="updateScore"
          @gameOver="handleGameOver"
          @nextPieceChanged="updateNextPiece"
          @gameState="gameState"
        />
      </div>

      <div class="control-panel">
        <ScoreBoard :score="score" class="panel-section" />
        <div class="panel-section control-buttons">
          <button class="btn-start" @click="startGame">开始游戏</button>
          <button class="btn-pause" @click="pauseGame">
            {{ isPaused ? "继续" : "暂停" }}
          </button>
          <button class="btn-reset" @click="resetGame">重新开始</button>
          <button class="btn-help" @click="showHelp = true">操作说明</button>
        </div>

        <div class="panel-section next-piece-panel">
          <h3>下一个方块</h3>
          <div class="next-piece-main">
            <div
              class="next-piece-grid"
              v-for="(cell, index) in nextPieceFlattened"
              :key="index"
            >
              <div
                v-for="(item, index) in cell"
                :key="index"
                :class="['next-piece-cell', { filled: item }]"
              ></div>
            </div>
          </div>
        </div>

        <RankBoard :rankData="rankData" class="panel-section" />
      </div>
    </div>

    <!-- Help Modal -->
    <div v-if="showHelp" class="modal-overlay" @click.self="showHelp = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>操作说明</h3>
          <button class="modal-close" @click="showHelp = false">&times;</button>
        </div>
        <div class="modal-body">
          <ul class="instruction-list">
            <li><span class="key">← →</span> 左右移动</li>
            <li><span class="key">↑</span> 旋转方块</li>
            <li><span class="key">↓</span> 加速下落</li>
            <li><span class="key">空格</span> 直接落到底部</li>
            <li><span class="key">P</span> 暂停/继续</li>
          </ul>
          <div class="scoring-rules">
            <h4>得分规则</h4>
            <ul>
              <li>消除1行: 100分</li>
              <li>消除2行: 300分</li>
              <li>消除3行: 500分</li>
              <li>消除4行: 800分</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import GameBoard from "./components/GameBoard.vue";
import ScoreBoard from "./components/ScoreBoard.vue";
import RankBoard from "./components/RankBoard.vue";

export default defineComponent({
  components: {
    GameBoard,
    ScoreBoard,
    RankBoard,
  },
  setup() {
    const gameBoardRef = ref<InstanceType<typeof GameBoard> | null>(null);
    const score = ref(0);
    const isPaused = ref(false);
    const showHelp = ref(false);
    const rankData = ref<{ name: string; score: number }[]>([]);
    const nextPieceFlattened = ref<number[][]>([[]]);

    const loadRankData = () => {
      const savedData = localStorage.getItem("tetrisRankData");
      if (savedData) {
        rankData.value = JSON.parse(savedData);
      }
    };
    // 获取随机名称
    function generateGameName(gender = "female") {
      // 优雅形容词库
      const adjectives = [
        "璀璨",
        "皎洁",
        "苍穹",
        "星河",
        "月影",
        "晨曦",
        "流风",
        "霜雪",
        "翡翠",
        "琉璃",
        "银翼",
        "圣光",
        "幻梦",
        "星轨",
        "永夜",
        "天籁",
      ];

      // 女性向名词库
      const femaleNouns = [
        "精灵",
        "歌姬",
        "玫瑰",
        "蝶舞",
        "百合",
        "天鹅",
        "人鱼",
        "月光",
        "花语",
        "星尘",
        "蔷薇",
        "仙灵",
        "诗篇",
        "铃音",
        "羽衣",
        "晨露",
      ];

      // 男性向名词库
      const maleNouns = [
        "战神",
        "龙裔",
        "圣剑",
        "苍穹",
        "烈阳",
        "铁壁",
        "雷霆",
        "星陨",
        "狼魂",
        "君王",
        "裁决",
        "天启",
        "荒原",
        "怒涛",
        "孤峰",
        "远征",
      ];

      // 姓氏/后缀库
      const surnames = [
        "之风",
        "之翼",
        "咏叹",
        "挽歌",
        "行者",
        "使者",
        "传承",
        "契约",
        "守望",
        "誓言",
        "咏唱",
        "低语",
        "咏叹",
        "幻象",
        "终章",
        "序曲",
      ];

      // 随机选择组件
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun =
        gender === "male"
          ? maleNouns[Math.floor(Math.random() * maleNouns.length)]
          : femaleNouns[Math.floor(Math.random() * femaleNouns.length)];
      const surname = surnames[Math.floor(Math.random() * surnames.length)];

      // 生成两种格式的名字
      const patterns = [
        () => `${adj}的${noun}·${surname}`, // 如"璀璨的精灵·星尘"
        () => `${noun}${surname}`, // 如"月影咏叹"
        () => `${adj}${noun}`, // 如"苍穹圣剑"
        () => `${noun}之${adj}`, // 如"龙裔之怒涛"
      ];

      // 随机选择一种格式
      const selectedPattern =
        patterns[Math.floor(Math.random() * patterns.length)];

      // 处理特殊符号并返回
      return selectedPattern().replace(/·/g, "·").replace(/\s+/g, "");
    }

    const updateScore = (newScore: number) => {
      score.value = newScore;
    };

    const nickname = generateGameName();
    const handleGameOver = () => {
      console.log("游戏结束");
      if (score.value <= 0) return;
      const playerIndex = rankData.value.findIndex(
        (item) => item.name === nickname
      );
      if (playerIndex >= 0) {
        rankData.value[playerIndex].score = Math.max(
          rankData.value[playerIndex].score,
          score.value
        );
      } else {
        rankData.value.push({ name: nickname, score: score.value });
      }

      rankData.value.sort((a, b) => b.score - a.score);
      rankData.value = rankData.value.slice(0, 10);
      localStorage.setItem("tetrisRankData", JSON.stringify(rankData.value));
    };

    const updateNextPiece = (piece: number[][]) => {
      nextPieceFlattened.value = piece;
    };

    const startGame = () => {
      gameBoardRef.value?.startGame();
      isPaused.value = false;
    };

    const pauseGame = () => {
      if (isPaused.value) {
        gameBoardRef.value?.resumeGame();
      } else {
        gameBoardRef.value?.pauseGame();
      }
      isPaused.value = !isPaused.value;
    };

    const resetGame = () => {
      gameBoardRef.value?.resetGame();
      isPaused.value = false;
    };
    const gameState = (e: any) => {
      if (e == "playing") {
        isPaused.value = false;
      } else {
        isPaused.value = true;
      }
    };

    loadRankData();
    return {
      gameBoardRef,
      score,
      isPaused,
      showHelp,
      rankData,
      nextPieceFlattened,
      updateScore,
      handleGameOver,
      updateNextPiece,
      startGame,
      pauseGame,
      resetGame,
      gameState,
    };
  },
});
</script>

<style lang="scss" scoped>
.game-page {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 20px;
  box-sizing: border-box;
}

.game-container {
  display: flex;
  gap: 25px;
  max-width: 900px;
  width: 100%;
}

.game-board-wrapper {
  flex: 1;
  min-width: 320px;
  max-width: 500px;
}

.control-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-section {
  width: 100%;
  box-sizing: border-box;
  background: #2c3e50;
  border-radius: 10px;
  padding: 18px;
  color: #ecf0f1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.next-piece-panel {
  h3 {
    margin: 0 0 15px 0;
    color: #f1c40f;
    font-size: 18px;
    text-align: center;
  }
}
.next-piece-main {
  padding: 20px;
  background: #34495e;
  border-radius: 8px;
  box-sizing: border-box;
  min-height: 90px;
}
.next-piece-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.next-piece-cell {
  aspect-ratio: 1;
  // background: #2c3e50;
  border-radius: 4px;
  // border: 1px solid rgba(52, 73, 94, 0.3);

  &.filled {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    border: 1px solid rgba(231, 76, 60, 0.8);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  }
}

.control-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  button {
    padding: 10px 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }

  .btn-start {
    grid-column: span 2;
    background: #27ae60;
    color: white;
  }

  .btn-pause {
    background: #f39c12;
    color: white;
  }

  .btn-reset {
    background: #e74c3c;
    color: white;
  }

  .btn-help {
    grid-column: span 2;
    background: #3498db;
    color: white;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: #2c3e50;
  border-radius: 8px;
  width: 90%;
  max-width: 350px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #34495e;
  border-bottom: 1px solid #2c3e50;

  h3 {
    margin: 0;
    color: #f1c40f;
    font-size: 16px;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #ecf0f1;
  cursor: pointer;
}

.modal-body {
  padding: 15px;
  color: #ecf0f1;

  .instruction-list {
    padding-left: 0;
    list-style: none;
    margin-bottom: 15px;

    li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
    }
  }

  .key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #34495e;
    border-radius: 4px;
    margin-right: 10px;
    font-family: monospace;
  }

  .scoring-rules {
    border-top: 1px dashed #34495e;
    padding-top: 12px;

    h4 {
      color: #f1c40f;
      margin: 0 0 10px 0;
      font-size: 15px;
    }

    ul {
      padding-left: 18px;
      margin: 0;
      font-size: 13px;
    }
  }
}

@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    align-items: center;
  }

  .game-board-wrapper {
    width: 100%;
    max-width: 340px;
  }

  .control-panel {
    width: 100%;
    max-width: 340px;
  }
  .next-piece-main {
    padding: 60px;
  }
}
</style>
