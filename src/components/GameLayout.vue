<template>
  <div
    class="mx-6 md:m-12 lg:my-0 lg:h-screen flex flex-col lg:flex-row gap-6 lg:gap-16 justify-center items-center"
  >
    <div
      class="flex flex-col justify-center lg:basis-5/12 xl:basis-1 w-full lg:w-auto lg:h-screen"
    >
      <PlayerInfo
        :name="topPlayerName"
        :material-advantage="topPlayerMaterialAdvantage"
      />
      <div class="w-full xl:h-3/4">
        <BoardRenderer
          :board="board"
          :reverse="reverseBoard"
          :currentMove="null"
          :lastMove="null"
          :isWhiteInCheck="isWhiteInCheck"
          :isBlackInCheck="isBlackInCheck"
          @click="handleClick"
          class="h-full rounded-2xl"
        />
      </div>
      <PlayerInfo
        :name="bottomPlayerName"
        :material-advantage="bottomPlayerMaterialAdvantage"
      />
    </div>
    <div class="h-full flex flex-col basis-1/4 w-full lg:w-auto">
      <div class="grow lg:my-16 p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <div class="flex flex-col gap-4">
          <GameHistory :moveHistory="moveHistory" />
          <div>
            <span
              class="px-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-medium rounded-lg"
            >
              {{ activeColor === PieceColor.White ? "White" : "Black" }} to move
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import GameHistory from "@/components/GameHistory.vue";
import PlayerInfo from "@/components/PlayerInfo.vue";
import type { Board, MoveItem } from "@/lib/types";
import { computed } from "vue";
import { get } from "@vueuse/core";
import { getMaterialValueByColor, isInCheck } from "@/lib/chess";
import { PieceColor } from "@/lib/types";

const props = defineProps<{
  board: Board;
  moveHistory: MoveItem[];
  reverseBoard: boolean;
  activeColor: PieceColor;
  isPlayer: boolean;
  playerColor: PieceColor;
  whitePlayerName: string;
  blackPlayerName: string;
}>();

const emit = defineEmits<{
  (event: "click", ...args: [number, number]): void;
}>();

const lastMove = computed(() => {
  return props.moveHistory[props.moveHistory.length - 1] || null;
});

// computed values for checking if the player is in check
const isWhiteInCheck = computed(() => {
  if (!get(lastMove)) return false;
  return isInCheck(get(lastMove), PieceColor.White);
});

const isBlackInCheck = computed(() => {
  if (!get(lastMove)) return false;
  return isInCheck(get(lastMove), PieceColor.Black);
});

// computed values for material advantage
const whiteMaterialValue = computed(() => {
  return getMaterialValueByColor(props.board.pieces, PieceColor.White);
});

const blackMaterialValue = computed(() => {
  return getMaterialValueByColor(props.board.pieces, PieceColor.Black);
});

const whiteMaterialAdvantage = computed(() => {
  return get(whiteMaterialValue) - get(blackMaterialValue);
});

const blackMaterialAdvantage = computed(() => {
  return get(blackMaterialValue) - get(whiteMaterialValue);
});

// computed values to display
const topPlayerName = computed(() => {
  if (props.reverseBoard) {
    return props.whitePlayerName;
  } else {
    return props.blackPlayerName;
  }
});

const bottomPlayerName = computed(() => {
  if (props.reverseBoard) {
    return props.blackPlayerName;
  } else {
    return props.whitePlayerName;
  }
});

const topPlayerMaterialAdvantage = computed(() => {
  if (props.reverseBoard) {
    return get(whiteMaterialAdvantage);
  } else {
    return get(blackMaterialAdvantage);
  }
});

const bottomPlayerMaterialAdvantage = computed(() => {
  if (props.reverseBoard) {
    return get(blackMaterialAdvantage);
  } else {
    return get(whiteMaterialAdvantage);
  }
});

const handleClick = (x: number, y: number) => {
  emit("click", x, y);
};
</script>
