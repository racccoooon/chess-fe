<template>
  <svg
    class="aspect-square select-none overflow-hidden"
    :viewBox="`0 0 ${tileAbsoluteWidth * 8 + borderAbsoluteSize * 2} ${
      tileAbsoluteHeight * 8 + borderAbsoluteSize * 2
    }`"
  >
    <rect width="100%" height="100%" class="fill-gray-100 dark:fill-gray-800" />
    <template v-for="i in 8" :key="i">
      <text
        :x="borderAbsoluteSize / 2"
        :y="(i - 1) * tileAbsoluteHeight + borderAbsoluteSize + 18"
        class="fill-gray-800 dark:fill-gray-100"
        font-size="20"
        font-weight="500"
        text-anchor="middle"
        dominant-baseline="middle"
        v-text="reverse ? i : 8 - i + 1"
      />
    </template>
    <template v-for="i in 8" :key="i">
      <text
        :x="i * tileAbsoluteWidth + borderAbsoluteSize - 18"
        :y="
          tileAbsoluteHeight * 8 + borderAbsoluteSize + borderAbsoluteSize / 2
        "
        class="fill-gray-800 dark:fill-gray-100"
        font-size="20"
        font-weight="500"
        text-anchor="middle"
        dominant-baseline="middle"
        v-text="String.fromCharCode(96 + (reverse ? 9 - i : i))"
      />
    </template>
    <svg
      :x="borderAbsoluteSize"
      :y="borderAbsoluteSize"
      :width="tileAbsoluteWidth * 8"
      :height="tileAbsoluteHeight * 8"
    >
      <template v-for="x in 8" :key="x">
        <template v-for="y in 8" :key="y">
          <rect
            :x="(x - 1) * tileAbsoluteWidth"
            :y="(y - 1) * tileAbsoluteHeight"
            :width="tileAbsoluteWidth"
            :height="tileAbsoluteHeight"
            :class="['fill-green-100', 'fill-green-500'][(x + y) % 2]"
            @click="
              handleClick(reverse ? 8 - x : x - 1, reverse ? y - 1 : 8 - y)
            "
          />
        </template>
      </template>
      <g>
        <rect
          v-for="(highlight, index) in highlightSquares"
          :x="
            (reverse ? 7 - highlight.cell.x : highlight.cell.x) *
            tileAbsoluteWidth
          "
          :y="
            (reverse ? highlight.cell.y : 8 - highlight.cell.y - 1) *
            tileAbsoluteHeight
          "
          :width="tileAbsoluteWidth"
          :height="tileAbsoluteHeight"
          :data-dark="!!((highlight.cell.x + highlight.cell.y) % 2)"
          :class="{
            'fill-yellow-300/75': highlight.color === HighlightColor.Yellow,
            'fill-red-400/75 data-[dark=true]:fill-red-300/90':
              highlight.color === HighlightColor.Red,
            'fill-lime-400/75 data-[dark=true]:fill-lime-500/90':
              highlight.color === HighlightColor.Green,
          }"
          @click="handleClick(selectedCell.x, selectedCell.y)"
          :key="index"
        />
      </g>
      <TransitionGroup>
        <PieceRenderer
          v-for="piece in board.pieces"
          :x="(reverse ? 7 - piece.x : piece.x) * 100 + 10"
          :y="(reverse ? piece.y : 7 - piece.y) * 100 + 10"
          width="80"
          height="80"
          :type="piece.type"
          :color="piece.color"
          :use-raccoon-tail="true"
          :use-raccoon-pawn="true"
          :key="piece.id"
          @click="handleClick(piece.x, piece.y)"
          :style="{
            filter:
              ((piece.color === PieceColor.White && isWhiteInCheck) ||
                (piece.color === PieceColor.Black && isBlackInCheck)) &&
              piece.type === PieceType.King
                ? 'drop-shadow(-4px -4px 1px rgba(239, 68, 68, 0.4)) \n' +
                  'drop-shadow(4px -4px 1px rgba(239, 68, 68, 0.4)) \n' +
                  'drop-shadow(4px 4px 1px rgba(239, 68, 68, 0.4))\n' +
                  'drop-shadow(-4px 4px 1px rgba(239, 68, 68, 0.4))'
                : '',
          }"
        />
      </TransitionGroup>
    </svg>
  </svg>
</template>

<script setup lang="ts">
import PieceRenderer from "@/components/PieceRenderer.vue";
import type { Board, BoardHighlightSquare, Cell } from "@/lib/types";
import { computed } from "vue";
import { HighlightColor, PieceColor, PieceType } from "@/lib/types";

const props = defineProps<{
  board: Board;
  reverse: boolean;
  isWhiteInCheck: boolean;
  isBlackInCheck: boolean;
  highlightSquares: BoardHighlightSquare[];
}>();

const emit = defineEmits<{
  (event: "click", ...args: [number, number]): void;
}>();

const tileAbsoluteWidth = 100;
const tileAbsoluteHeight = 100;
const borderAbsoluteSize = 33;

const handleClick = (x: number, y: number) => {
  emit("click", x, y);
};

/***
 * the cell that is currently selected, with reversed board.
 */
const selectedCell = computed((): Cell => {
  let x = props.currentMove?.from?.x || 0;
  let y = props.currentMove?.from?.y || 0;

  return {
    x: props.reverse ? 7 - x : x,
    y: props.reverse ? y : 7 - y,
  };
});
</script>
