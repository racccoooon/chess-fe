<template>
  <svg
    class="w-[800px] aspect-square select-none rounded-2xl overflow-hidden"
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
            :class="
              ['fill-green-100', 'fill-green-500'][
                reverse ? (x + y + 1) % 2 : (x + y) % 2
              ]
            "
            @click="
              handleClick(reverse ? 8 - x : x - 1, reverse ? y - 1 : 8 - y)
            "
          />
        </template>
      </template>
      <rect
        v-if="lastMove !== null"
        :x="
          (reverse ? 7 - lastMove.fromCell.x : lastMove.fromCell.x) *
          tileAbsoluteWidth
        "
        :y="
          (reverse ? lastMove.fromCell.y : 8 - lastMove.fromCell.y - 1) *
          tileAbsoluteHeight
        "
        :width="tileAbsoluteWidth"
        :height="tileAbsoluteHeight"
        class="fill-yellow-300/75"
      />
      <rect
        v-if="lastMove !== null"
        :x="
          (reverse ? 7 - lastMove.toCell.x : lastMove.toCell.x) *
          tileAbsoluteWidth
        "
        :y="
          (reverse ? lastMove.toCell.y : 8 - lastMove.toCell.y - 1) *
          tileAbsoluteHeight
        "
        :width="tileAbsoluteWidth"
        :height="tileAbsoluteHeight"
        class="fill-yellow-300/75"
      />
      <rect
        v-if="currentMove !== null"
        :x="selectedCell.x * tileAbsoluteWidth"
        :y="selectedCell.y * tileAbsoluteHeight"
        :width="tileAbsoluteWidth"
        :height="tileAbsoluteHeight"
        class="fill-red-300/75"
      />
      <TransitionGroup>
        <PieceRenderer
          v-for="piece in board.pieces"
          :x="reverse ? 7 - piece.x : piece.x"
          :y="reverse ? 7 - piece.y : piece.y"
          :type="piece.type"
          :color="piece.color"
          :key="piece.id"
          @click="handleClick(piece.x, piece.y)"
        />
      </TransitionGroup>
    </svg>
  </svg>
</template>

<script setup lang="ts">
import PieceRenderer from "@/components/PieceRenderer.vue";
import type { Board, Cell, Move, PartialMove } from "@/lib/types";
import { computed } from "vue";

const props = defineProps<{
  board: Board;
  reverse: boolean;
  currentMove: PartialMove | null;
  lastMove: Move | null;
}>();

const emit = defineEmits<{
  (event: "click", ...args: [number, number]): void;
}>();

const tileAbsoluteWidth = 100;
const tileAbsoluteHeight = 100;
const borderAbsoluteSize = 33;

const handleClick = (x: number, y: number) => {
  console.log("clicked on board:", x, y);
  emit("click", x, y);
};

/***
 * the cell that is currently selected, with reversed board.
 */
const selectedCell = computed((): Cell => {
  let x = props.currentMove?.fromCell?.x || 0;
  let y = props.currentMove?.fromCell?.y || 0;

  return {
    x: props.reverse ? 7 - x : x,
    y: props.reverse ? y : 7 - y,
  };
});
</script>
