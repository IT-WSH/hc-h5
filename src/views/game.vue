<template>
  <div class="main">
    <div class="main-tit">
      选中游戏参与人数
      <div class="num">
        {{ selectObj.length ? `(${selectObj.length}人)` : "" }}
      </div>
    </div>
    <div class="main-list">
      <div
        class="main-li"
        @click="setCheck(item)"
        :class="{ active: item.check }"
        v-for="(item, index) in oldPeople"
        :key="index"
      >
        {{ item.name }}
        <div class="main-li-name">{{ item.gameName }}</div>
      </div>
    </div>
    <div class="main-btn" @click="startGroup">开始分组</div>
    <div class="list-time">{{ getTimeString() }}</div>
    <div class="main-group">
      <div class="group-li" v-for="(group, index) in newGroup" :key="index">
        <div class="group-li-tit">分组{{ index + 1 }}:</div>
        <div class="main-list list-b">
          <div class="main-li" v-for="(item, index) in group" :key="index">
            {{ item.name }}
            <div class="main-li-name">{{ item.gameName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, Ref, ref } from "vue";
type People = {
  name: string;
  check: boolean;
  level?: string;
  gameName: string;
};

const oldPeople: Ref<People[]> = ref([
  {
    name: "魏斯海",
    check: true,
    level: "",
    gameName: "丿wo真的无语咯丿",
  },
  {
    name: "赵金乐",
    check: false,
    level: "",
    gameName: "我真的努力过",
  },
  {
    name: "汤艺",
    check: true,
    level: "",
    gameName: "大熊大熊丶",
  },
  {
    name: "黄先生",
    check: false,
    gameName: "好男人隔壁老王",
  },
  {
    name: "世杰",
    check: false,
    level: "",
    gameName: "本意本意子",
  },
  {
    name: "尹恒",
    check: false,
    level: "",
    gameName: "电一黄金质检员",
  },
  {
    name: "狐狸",
    check: false,
    level: "",
    gameName: "MingMeikoCrisp",
  },
  {
    name: "叶宇琪",
    check: true,
    level: "",
    gameName: "叶小琪",
  },
  {
    name: "狗头",
    check: false,
    level: "",
    gameName: "给我皎月能C",
  },
  {
    name: "迪辉",
    check: false,
    level: "",
    gameName: "stare丶陌辰",
  },
  {
    name: "有球必应",
    check: false,
    level: "",
    gameName: "子正切",
  },
  {
    name: "一只兔子",
    check: false,
    level: "",
    gameName: "黄泉碧落无觅",
  },
  {
    name: "李杰",
    check: false,
    level: "",
    gameName: "Rankoko",
  },
  {
    name: "Dcat",
    check: false,
    level: "",
    gameName: "刺猬的拥抱r",
  },

  {
    name: "接化发",
    check: true,
    level: "",
    gameName: "-接-化-发",
  },

  {
    name: "有花方酌酒",
    check: true,
    level: "",
    gameName: "有花方酌酒",
  },
  {
    name: "断水流大师兄",
    check: true,
    level: "",
    gameName: "断水流大师兄",
  },
  {
    name: "有毛啊滚出我棋盘",
    check: false,
    level: "",
    gameName: "有毛啊滚出我棋盘",
  },
  {
    name: "天才杨梦雪",
    check: true,
    level: "",
    gameName: "天才杨梦雪",
  },
  {
    name: "陈子安",
    check: true,
    level: "",
    gameName: "陈半仙",
  },
  {
    name: "易斩千机",
    check: true,
    level: "",
    gameName: "易斩千机",
  },
  {
    name: "Aileen1110",
    check: true,
    level: "",
    gameName: "Aileen1110",
  },
]);
// 点击修改状态
function setCheck(item: any) {
  item.check = !item.check;
}
// 计算属性获取选中对象
const selectObj = computed(() => {
  return oldPeople.value.filter((item) => item.check);
});

let newGroup: Ref<People[][]> = ref([]);
// 随机分组得到新数组
function startGroup() {
  // 获取新数组
  newGroup.value = groupPeople(selectObj.value, 2);
}
function groupPeople(people: People[], groupSize: number) {
  groupSize = Math.ceil(people.length / 2);
  // 先将人员列表随机打乱
  const shuffledPeople = shuffleArray(people.slice());
  const groups = [];
  let currentGroup = [];
  // 将打乱后的人员进行分组
  for (let i = 0; i < shuffledPeople.length; i++) {
    currentGroup.push(shuffledPeople[i]);
    // 当达到每组人数时，将当前组添加到结果中，并清空当前组
    if (currentGroup.length === groupSize) {
      groups.push(currentGroup.slice());
      currentGroup = [];
    }
  }
  // 如果还有剩余人员，将剩余人员组成一组
  if (currentGroup.length > 0) {
    groups.push(currentGroup.slice());
  }
  return groups;
}
function getTimeString() {
  // 获取当前日期和时间
  const now = new Date();
  // 格式化为年月日时分秒
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

function shuffleArray(array: People[]) {
  // 数组随机打乱算法
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  position: relative;
  overflow: hidden;
}

.main-tit {
  font-size: 2.5rem;
  width: 100%;
  line-height: 3rem;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-weight: bold;
  position: relative;
  padding-left: 1.5rem;
  color: #f1c40f;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
  animation: glow 2s ease-in-out infinite alternate;

  &::before {
    content: "";
    width: 6px;
    height: 2rem;
    background: linear-gradient(to bottom, #e74c3c, #f1c40f);
    position: absolute;
    left: 0;
    top: 50%;
    border-radius: 3px;
    transform: translateY(-50%);
    box-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
  }

  .num {
    margin-left: 1rem;
    font-size: 1.5rem;
    color: #2ecc71;
    text-shadow: 0 0 8px rgba(46, 204, 113, 0.5);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 5px rgba(241, 196, 15, 0.5);
  }
  to {
    text-shadow: 0 0 15px rgba(241, 196, 15, 0.8),
      0 0 20px rgba(241, 196, 15, 0.6);
  }
}

.list-time {
  font-size: 1.2rem;
  width: 100%;
  line-height: 2rem;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #3498db;
  text-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
  padding-left: 1rem;
}

.main-list {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.main-li {
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 1rem;
  background: rgba(44, 62, 80, 0.7);
  backdrop-filter: blur(5px);
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-color: rgba(231, 76, 60, 0.5);
  }

  &.active {
    border: 2px solid #e74c3c;
    color: white;
    background: rgba(231, 76, 60, 0.2);
    box-shadow: 0 0 15px rgba(231, 76, 60, 0.5),
      inset 0 0 10px rgba(231, 76, 60, 0.3);
    transform: scale(1.05);
  }
}

.main-li-name {
  font-size: 1.2rem;
  color: #2ecc71;
  text-shadow: 0 0 8px rgba(46, 204, 113, 0.3);
  margin-top: 0.5rem;
}

.group-li {
  font-size: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-direction: column;
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  background: rgba(44, 62, 80, 0.5);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(52, 152, 219, 0.5);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  }
}

.group-li-tit {
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f1c40f;
  text-shadow: 0 0 8px rgba(241, 196, 15, 0.3);
}

.main-btn {
  width: 80%;
  height: 3.5rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 2rem auto;
  color: white;
  background: linear-gradient(135deg, #e74c3c, #f39c12);
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(231, 76, 60, 0.6);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
  }
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;

  .particle {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    animation: float-particle 15s infinite linear;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        left: random(100) * 1%;
        top: random(100) * 1%;
        animation-delay: random(5) * 1s;
      }
    }
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
  .main {
    padding: 1rem;
  }

  .main-tit {
    font-size: 1.8rem;
  }

  .main-btn {
    width: 90%;
  }
}
</style>
