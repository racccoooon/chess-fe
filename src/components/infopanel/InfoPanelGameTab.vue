<template>
  <div class="grow flex flex-col gap-8 justify-between">
    <div class="flex flex-col gap-4">
      <template v-if="gameHasStarted">
        <GameHistory :moveHistory="moveHistory" />
        <div>
          <span
            class="px-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-medium rounded-lg"
          >
            {{ activeColor === PieceColor.White ? "White" : "Black" }} to move
          </span>
        </div>
      </template>
      <template v-else>
        <h2 class="p-4 text-gray-700 dark:text-gray-200 text-xl font-bold">
          Waiting for opponent to join...
        </h2>
      </template>
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
  gameHasStarted: boolean;
}>();
</script>
