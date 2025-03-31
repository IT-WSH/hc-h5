<template>
  <div class="cricular">
    <div class="cricular-li">1</div>
    <div class="cricular-li">2</div>
    <div class="cricular-li">3</div>
    <div class="cricular-li">4</div>
    <div class="cricular-li">5</div>
    <div class="cricular-li">6</div>
  </div>
  <div class="msg">鼠标移入试试</div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
@use "sass:math";
.cricular {
  border: 40px solid rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  position: relative;
  margin: 20px auto;
  cursor: pointer;
  .cricular-li {
    opacity: 0;
    $w: 20px;
    $r: -10px;
    position: absolute;
    width: $w;
    height: $w;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 50%;
    margin-top: $r;
    margin-left: $r;
    transition: all 500ms;
  }
  &:hover {
    .cricular-li {
      opacity: 1;
    }
    $r: 65px; // 半径
    $n: 6; // 多少份
    $pDeg: math.div(360deg, $n); // 角度
    @for $i from 1 through $n {
      .cricular-li:nth-child(#{$i}) {
        $d: ($i - 1) * $pDeg;
        $x: $r * math.sin($d);
        $y: -$r * math.cos($d);
        transform: translate($x, $y);
      }
    }
  }
}
</style>
