<template>
  <div class="flex flex-wrap gap-2 overflow-y-auto">
    <div v-for="(moveGroup, index) in groupedMoves" :key="index">
      <div class="flex flex-row items-center gap-2">
        <span class="text-gray-500 dark:text-gray-300">{{ index + 1 }}.</span>
        <div class="flex flex-row items-center gap-1">
          <span
            class="px-1 bg-gray-200 dark:bg-gray-700 font-bold rounded-lg"
            v-for="(move, index) in moveGroup"
            :key="index"
          >
            {{ getMoveNotation(move, NotationType.LongAlgebraic, false) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MoveItem } from "@/lib/types";
import { getMoveNotation, NotationType } from "@/lib/chessNotation";
import { computed } from "vue";

const props = defineProps<{
  moveHistory: MoveItem[];
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
</script>
