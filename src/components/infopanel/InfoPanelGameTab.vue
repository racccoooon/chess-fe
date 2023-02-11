<template>
  <div class="grow flex flex-col gap-8 justify-between">
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
</template>

<script setup lang="ts">
import GameHistory from "@/components/GameHistory.vue";
import type { MoveItem } from "@/lib/types";
import { PieceColor } from "@/lib/types";

defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  isPlayer: boolean;
}>();
</script>
