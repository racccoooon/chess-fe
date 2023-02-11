<template>
  <div class="grow flex flex-col gap-8 justify-between">
    <div class="flex flex-col gap-6">
      <template v-if="gameHasStarted">
        <div
          class="text-gray-400 dark:text-gray-500 font-medium text-sm"
          v-if="opening"
        >
          {{ opening }}
        </div>
        <GameHistory :moveHistory="moveHistory" />
      </template>
      <template v-else>
        <h2 class="p-4 text-gray-700 dark:text-gray-200 text-xl font-bold">
          Waiting for opponent to join...
        </h2>
      </template>
    </div>
    <div>
      <span
        class="px-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-medium rounded-lg"
      >
        {{ activeColor === PieceColor.White ? "White" : "Black" }}'s move
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameHistory from "@/components/GameHistory.vue";
import type { MoveItem } from "@/lib/types";
import { PieceColor } from "@/lib/types";
import { getChessOpening } from "@/lib/chessOpenings";
import { set } from "@vueuse/core";
import { ref, watch } from "vue";

const props = defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  isPlayer: boolean;
  gameHasStarted: boolean;
}>();

const opening = ref<string | null>(null);

const getOpening = async () => {
  const res = getChessOpening(props.moveHistory);

  set(opening, res ? res.name : null);
};

watch(() => ref(props.moveHistory.length), getOpening);

getOpening();
</script>
