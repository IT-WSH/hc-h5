<template>
  <div class="game-board">
    <div class="board-grid">
      <div
        v-for="(cell, index) in flattenedBoard"
        :key="index"
        :class="['cell', { filled: cell }]"
      ></div>
    </div>
    <div v-if="gameStatus === 'ready'" class="game-overlay welcome-overlay">
      <div class="overlay-content welcome-content">
        <h2>俄罗斯方块</h2>
        <div class="welcome-description">
          <p>经典游戏，挑战你的极限！</p>
          <div class="features">
            <div class="feature-item">
              <span class="feature-icon">🎮</span>
              <span>经典玩法</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🏆</span>
              <span>排行榜</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🚀</span>
              <span>难度提升</span>
            </div>
          </div>
        </div>
        <button class="start-button" @click="startGame">开始游戏</button>
      </div>
    </div>

    <div v-if="gameStatus === 'gameover'" class="game-overlay">
      <div class="overlay-content">
        <h2>游戏结束</h2>
        <p>最终得分: {{ score }}</p>
        <button @click="resetGame">重新开始</button>
      </div>
    </div>

    <div v-if="gameStatus === 'paused'" class="game-overlay">
      <div class="overlay-content">
        <h2>游戏暂停</h2>
        <button @click="resumeGame">继续游戏</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";

type Piece = number[][];
type Board = number[][];
type GameStatus = "ready" | "playing" | "paused" | "gameover";

const ALL_SHAPES: Piece[] = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
];

export default defineComponent({
  setup(props, { emit }) {
    console.log(props);

    const gameStatus = ref<GameStatus>("ready");
    const board = ref<Board>(
      Array.from({ length: 20 }, () => Array(10).fill(0))
    );
    const currentPiece = ref<Piece>([]);
    const nextPiece = ref<Piece>([]);
    const currentPieceX = ref(0);
    const currentPieceY = ref(0);
    const score = ref(0);
    const interval = ref<ReturnType<typeof setTimeout> | null | undefined>(
      null
    );
    const gameSpeed = ref(500);
    const flattenedBoard = ref<number[]>([]);
    const pieceBag = ref<Piece[]>([]);

    const shuffleArray = (array: Piece[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    const refillPieceBag = () => {
      pieceBag.value = shuffleArray([...ALL_SHAPES]);
    };

    const generatePiece = () => {
      if (pieceBag.value.length === 0) {
        refillPieceBag();
      }

      if (nextPiece.value.length > 0) {
        currentPiece.value = JSON.parse(JSON.stringify(nextPiece.value));
      } else {
        currentPiece.value = JSON.parse(JSON.stringify(pieceBag.value.pop()!));
      }
    };

    const generateNextPiece = () => {
      if (pieceBag.value.length === 0) {
        refillPieceBag();
      }
      nextPiece.value = JSON.parse(JSON.stringify(pieceBag.value.pop()!));
      emit("nextPieceChanged", nextPiece.value);
    };

    const initGame = () => {
      board.value = Array.from({ length: 20 }, () => Array(10).fill(0));
      score.value = 0;
      gameStatus.value = "playing";
      gameSpeed.value = 500;

      refillPieceBag();

      generatePiece();
      generateNextPiece();

      currentPieceX.value = Math.floor((10 - currentPiece.value[0].length) / 2);
      currentPieceY.value = 0;

      startGameLoop();
      updateGameState();
      emit("scoreUpdated", score.value);
    };

    const lockPiece = () => {
      for (let y = 0; y < currentPiece.value.length; y++) {
        for (let x = 0; x < currentPiece.value[y].length; x++) {
          if (currentPiece.value[y][x]) {
            const boardY = currentPieceY.value + y;
            const boardX = currentPieceX.value + x;
            if (boardY >= 0) {
              board.value[boardY][boardX] = 1;
            }
          }
        }
      }

      if (currentPieceY.value <= 0) {
        gameOver();
        return;
      }

      clearLines();

      generatePiece();
      generateNextPiece();

      currentPieceX.value = Math.floor((10 - currentPiece.value[0].length) / 2);
      currentPieceY.value = 0;

      if (checkCollision(currentPieceX.value, currentPieceY.value)) {
        gameOver();
      }

      updateGameState();
    };

    const rotatePiece = () => {
      if (gameStatus.value !== "playing") return;

      const rotated = currentPiece.value[0].map((_, i) =>
        currentPiece.value.map((row) => row[i]).reverse()
      );

      if (!checkCollision(currentPieceX.value, currentPieceY.value, rotated)) {
        currentPiece.value = rotated;
        updateGameState();
      } else {
        const offsets = [-1, 1, -2, 2];
        for (const offset of offsets) {
          if (
            !checkCollision(
              currentPieceX.value + offset,
              currentPieceY.value,
              rotated
            )
          ) {
            currentPieceX.value += offset;
            currentPiece.value = rotated;
            updateGameState();
            break;
          }
        }
      }
    };

    const checkCollision = (
      x: number,
      y: number,
      piece: Piece = currentPiece.value
    ): boolean => {
      for (let py = 0; py < piece.length; py++) {
        for (let px = 0; px < piece[py].length; px++) {
          if (piece[py][px]) {
            const newX = x + px;
            const newY = y + py;

            if (newX < 0 || newX >= 10 || newY >= 20) {
              return true;
            }

            if (newY >= 0 && board.value[newY][newX]) {
              return true;
            }
          }
        }
      }
      return false;
    };

    const movePiece = (direction: "left" | "right" | "down") => {
      if (gameStatus.value !== "playing") return;

      let newX = currentPieceX.value;
      let newY = currentPieceY.value;

      switch (direction) {
        case "left":
          newX--;
          break;
        case "right":
          newX++;
          break;
        case "down":
          newY++;
          break;
      }

      if (!checkCollision(newX, newY)) {
        currentPieceX.value = newX;
        currentPieceY.value = newY;
        updateGameState();

        if (direction === "down") {
          resetGameLoop();
        }
      } else if (direction === "down") {
        lockPiece();
      }
    };

    const clearLines = () => {
      let linesCleared = 0;

      for (let y = board.value.length - 1; y >= 0; y--) {
        if (board.value[y].every((cell) => cell)) {
          board.value.splice(y, 1);
          board.value.unshift(Array(10).fill(0));
          linesCleared++;
          y++;
        }
      }

      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared] || 800;
        score.value += points;
        emit("scoreUpdated", score.value);

        if (score.value > 1000 && gameSpeed.value > 200) {
          gameSpeed.value = Math.max(
            200,
            500 - Math.floor(score.value / 1000) * 50
          );
          resetGameLoop();
        }
      }
    };

    const startGameLoop = () => {
      stopGameLoop();
      interval.value = setInterval(() => {
        if (gameStatus.value === "playing") {
          movePiece("down");
        }
      }, gameSpeed.value);
    };

    const resetGameLoop = () => {
      if (interval.value) {
        clearInterval(interval.value);
        startGameLoop();
      }
    };

    const stopGameLoop = () => {
      if (interval.value) {
        clearInterval(interval.value);
        interval.value = null;
      }
    };

    const startGame = () => {
      if (gameStatus.value === "ready" || gameStatus.value === "gameover") {
        initGame();
      }
    };

    const pauseGame = () => {
      if (gameStatus.value === "playing") {
        gameStatus.value = "paused";
        stopGameLoop();
      }
    };

    const resumeGame = () => {
      if (gameStatus.value === "paused") {
        gameStatus.value = "playing";
        startGameLoop();
      }
    };
    watch(gameStatus, () => {
      setGameState();
    });
    const setGameState = () => {
      emit("gameState", gameStatus.value);
    };

    const gameOver = () => {
      gameStatus.value = "gameover";
      stopGameLoop();
      emit("gameOver", score.value);
    };

    const resetGame = () => {
      stopGameLoop();
      initGame();
    };

    const updateGameState = () => {
      const tempBoard = JSON.parse(JSON.stringify(board.value));

      for (let y = 0; y < currentPiece.value.length; y++) {
        for (let x = 0; x < currentPiece.value[y].length; x++) {
          if (currentPiece.value[y][x]) {
            const boardY = currentPieceY.value + y;
            const boardX = currentPieceX.value + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              tempBoard[boardY][boardX] = 1;
            }
          }
        }
      }

      flattenedBoard.value = tempBoard.flat();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (gameStatus.value !== "playing") return;

      e.preventDefault();
      switch (e.key) {
        case "ArrowLeft":
          movePiece("left");
          break;
        case "ArrowRight":
          movePiece("right");
          break;
        case "ArrowDown":
          movePiece("down");
          break;
        case "ArrowUp":
          rotatePiece();
          break;
        case "p":
        case "P":
          pauseGame();
          break;
        case " ":
          while (
            !checkCollision(currentPieceX.value, currentPieceY.value + 1)
          ) {
            currentPieceY.value++;
          }
          lockPiece();
          break;
      }
    };

    onMounted(() => {
      window.addEventListener("keydown", onKeyDown);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", onKeyDown);
      stopGameLoop();
    });

    return {
      flattenedBoard,
      score,
      gameStatus,
      startGame,
      pauseGame,
      resumeGame,
      resetGame,
      getNextPiece: () => nextPiece.value,
      emitNextPiece: () => emit("nextPieceChanged", nextPiece.value),
    };
  },
});
</script>

<style lang="scss" scoped>
.game-board {
  width: 100%;
  aspect-ratio: 1/2;
  position: relative;
  background: #2c3e50;
  border: 3px solid #34495e;
  border-radius: 8px;
  overflow: hidden;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(20, 1fr);
  width: 100%;
  height: 100%;
}

.cell {
  aspect-ratio: 1;
  border: 1px solid rgba(52, 73, 94, 0.4);
  background: rgba(44, 62, 80, 0.7);

  &.filled {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    border: 1px solid rgba(231, 76, 60, 0.8);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  }
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.welcome-overlay {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
}
.welcome-content {
  width: 80%;
  max-width: 320px;
  padding: 25px;
  text-align: center;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  h2 {
    color: #f1c40f;
    font-size: 28px;
    margin: 0 0 20px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .welcome-description {
    margin-bottom: 25px;

    p {
      color: #ecf0f1;
      font-size: 16px;
      margin: 0 0 20px;
    }
  }

  .features {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #ecf0f1;
    font-size: 14px;

    .feature-icon {
      font-size: 24px;
    }
  }
  .start-button {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(46, 204, 113, 0.2);
    }
  }
}

.overlay-content {
  min-width: 60%;
  background: #2c3e50;
  padding: 20px 10px;
  border-radius: 8px;
  text-align: center;
  color: white;

  h2 {
    color: #f1c40f;
    margin-bottom: 12px;
    font-size: 18px;
  }

  button {
    background: #27ae60;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;

    &:hover {
      background: #2ecc71;
    }
  }
}
</style>
