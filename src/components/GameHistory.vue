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
            class="px-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 aria-selected:bg-yellow-300 aria-selected:dark:bg-yellow-600 font-bold rounded-lg transition-colors"
            v-for="(move, itemIndex) in moveGroup"
            :key="itemIndex"
            @click="emit('timeTravelAbsolute', groupIndex * 2 + itemIndex + 1)"
          >
            {{ move }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MoveItem } from "@/lib/types";
import { asyncGetMoveNotation } from "@/lib/chessNotation";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import { getBoardAtHistoryIndex, getHistoryUntilIndex } from "@/lib/chess";
import { computedAsync, get } from "@vueuse/core";

const props = defineProps<{
  moveHistory: MoveItem[];
  historyIndex?: number;
}>();

const emit = defineEmits<{
  (event: "timeTravelAbsolute", payload: number): void;
}>();

const groupedMoves = computed(() => {
  let groupedMoves: MoveItem[][] = [];
  let currentMoveGroup: MoveItem[] = [];

  for (let i = 0; i < props.moveHistory.length; i++) {
    currentMoveGroup.push(props.moveHistory[i]);

    if (i % 2 === 0) {
      groupedMoves.push(currentMoveGroup);
    } else if (i % 2 === 1) {
      currentMoveGroup = [];
    }
  }

  return groupedMoves;
});

const gameNotation = computedAsync(
  async () => {
    const arr: string[][] = [];

    for (let i = 0; i < get(groupedMoves).length; i++) {
      const moveGroup = get(groupedMoves)[i];

      arr[i] = [];

      for (let j = 0; j < moveGroup.length; j++) {
        const move = moveGroup[j];

        const notation = await asyncGetMoveNotation(
          move,
          get(notationType),
          get(useUnicodeIconsInNotation),
          getBoardAtHistoryIndex(props.moveHistory, i * 2 + j),
          getHistoryUntilIndex(props.moveHistory, i * 2 + j)
        );

        arr[i].push(notation);
      }
    }

    return arr;
  },
  [],
  { lazy: true }
);

const { notationType, useUnicodeIconsInNotation } = storeToRefs(
  useSettingsStore()
);
</script>
