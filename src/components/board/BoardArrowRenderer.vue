<template>
  <g>
    <polygon
      class="arrow"
      :points="arrowPointsString"
      :class="getHighlightFillClass(arrow.color)"
    />
  </g>
</template>

<script setup lang="ts">
import type { BoardArrow, Vector2 } from "@/lib/types";
import { computed } from "vue";
import { get } from "@vueuse/core";
import { getHighlightFillClass } from "@/lib/chessBoard";

const props = defineProps<{
  arrow: BoardArrow;
  squareSize: number;
  reverse: boolean;
}>();

const boardXToDisplayX = (x: number) => {
  if (props.reverse) {
    return 7 - x;
  } else {
    return x;
  }
};

const boardYToDisplayY = (y: number) => {
  if (props.reverse) {
    return y;
  } else {
    return 7 - y;
  }
};

const lineStartPoint = computed((): Vector2 => {
  return {
    x:
      boardXToDisplayX(props.arrow.from.x) * props.squareSize +
      props.squareSize / 2,
    y:
      boardYToDisplayY(props.arrow.from.y) * props.squareSize +
      props.squareSize / 2,
  };
});

const lineEndPoint = computed((): Vector2 => {
  return {
    x:
      boardXToDisplayX(props.arrow.to.x) * props.squareSize +
      props.squareSize / 2,
    y:
      boardYToDisplayY(props.arrow.to.y) * props.squareSize +
      props.squareSize / 2,
  };
});

const arrowPoints = computed((): Vector2[] => {
  const x1 = get(lineStartPoint).x;
  const y1 = get(lineStartPoint).y;
  const x2 = get(lineEndPoint).x;
  const y2 = get(lineEndPoint).y;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx); // angle in radians

  // the start but a bit later
  const x3 = x1 + Math.cos(angle) * 30;
  const y3 = y1 + Math.sin(angle) * 30;

  // the end but a bit before
  const x4 = x2 - Math.cos(angle) * 30;
  const y4 = y2 - Math.sin(angle) * 30;

  // calculate bottom left and right points of arrow shaft
  const shaftBottom1 = {
    x: x3 - Math.cos(angle - Math.PI / 2) * 10,
    y: y3 - Math.sin(angle - Math.PI / 2) * 10,
  };

  const shaftBottom2 = {
    x: x3 - Math.cos(angle + Math.PI / 2) * 10,
    y: y3 - Math.sin(angle + Math.PI / 2) * 10,
  };

  // calculate top left and right points of arrow shaft
  const shaftTop1 = {
    x: x4 + Math.cos(angle + Math.PI / 2) * 10,
    y: y4 + Math.sin(angle + Math.PI / 2) * 10,
  };

  const shaftTop2 = {
    x: x4 + Math.cos(angle - Math.PI / 2) * 10,
    y: y4 + Math.sin(angle - Math.PI / 2) * 10,
  };

  // calculate top left and right points of arrow head
  const headTop1 = {
    x: x4 + Math.cos(angle + Math.PI / 2) * 25,
    y: y4 + Math.sin(angle + Math.PI / 2) * 25,
  };

  const headTop2 = {
    x: x4 + Math.cos(angle - Math.PI / 2) * 25,
    y: y4 + Math.sin(angle - Math.PI / 2) * 25,
  };

  // calculate arrow tip
  const headTip = {
    x: x2,
    y: y2,
  };

  // return points in clockwise order
  return [
    shaftBottom1,
    shaftBottom2,
    shaftTop2,
    headTop2,
    headTip,
    headTop1,
    shaftTop1,
  ];
});

const arrowPointsString = computed((): string => {
  return arrowPoints.value
    .map((point) => {
      return `${point.x},${point.y}`;
    })
    .join(" ");
});
</script>
