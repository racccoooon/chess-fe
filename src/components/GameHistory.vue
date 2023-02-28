<template>
  <div class="flex flex-wrap gap-2 overflow-y-auto">
    <div v-for="(moveGroup, groupIndex) in gameNotation" :key="groupIndex">
      <div class="flex flex-row items-center gap-2">
        <span class="text-gray-500 dark:text-gray-300"
          >{{ groupIndex + 1 }}.</span
        >
        <div class="flex flex-row items-center gap-1">
          <button
            :aria-selected="historyIndex === groupIndex * 2 + itemIndex + 1"
            class="px-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 aria-selected:bg-gray-400 aria-selected:dark:bg-gray-500 font-bold rounded-lg transition-colors"
            v-for="(move, itemIndex) in moveGroup"
            :key="itemIndex"
            @click="emit('timeTravelAbsolute', groupIndex * 2 + itemIndex + 1)"
          >
            {{ move }}
          </button>
        </div>
      </div>
    </div>
    <span
      v-if="
        gameResult &&
        [GameResult.WhiteWins, GameResult.BlackWins, GameResult.Draw].includes(
          gameResult
        )
      "
      class="font-bold"
      v-text="gameResultNotation[gameResult]"
    />
  </div>
</template>

<script setup lang="ts">
import type { MoveItem } from "@/lib/types";
import { gameResultNotation, getMoveNotation } from "@/lib/chessNotation";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import {
  applyMove,
  defaultFen,
  fenToPieces,
  getHistoryUntilIndex,
} from "@/lib/chess";
import { get } from "@vueuse/core";
import { GameResult } from "@/lib/types";

const props = defineProps<{
  moveHistory: MoveItem[];
  historyIndex?: number;
  setupFen?: string;
  gameResult?: GameResult;
}>();

const emit = defineEmits<{
  (event: "timeTravelAbsolute", payload: number): void;
}>();

const gameNotation = computed(() => {
  let pieces = [...fenToPieces(props.setupFen || defaultFen)];
  const gameNotation: string[] = [];

  props.moveHistory.forEach((move, index) => {
    const notation = getMoveNotation(
      move,
      get(notationType),
      get(useUnicodeIconsInNotation),
      pieces,
      getHistoryUntilIndex(props.moveHistory, index)
    );

    gameNotation.push(notation);

    pieces = applyMove(pieces, move);
  });

  const arr: string[][] = [];

  for (let i = 0; i < gameNotation.length; i += 2) {
    arr.push([gameNotation[i], gameNotation[i + 1]]);
  }

  return arr;
});

const { notationType, useUnicodeIconsInNotation } = storeToRefs(
  useSettingsStore()
);
</script>
