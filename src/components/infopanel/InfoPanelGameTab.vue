<template>
  <div class="grow flex flex-col gap-8 justify-between h-min">
    <div class="flex flex-col gap-6">
      <template v-if="gameHasStarted">
        <div
          class="text-gray-400 dark:text-gray-500 font-medium text-sm"
          v-if="opening"
        >
          {{ opening }}
        </div>
        <GameHistory
          :moveHistory="moveHistory"
          :history-index="historyIndex"
          :setup-fen="setupFen"
          @time-travel-absolute="emit('timeTravelAbsolute', $event)"
        />
      </template>
      <template v-else>
        <h2 class="p-4 text-gray-700 dark:text-gray-200 text-xl font-bold">
          Waiting for opponent to join...
        </h2>
      </template>
    </div>
    <div
      class="flex flex-row flex-wrap sm:flex-nowrap justify-between gap-4 sm:gap-2"
    >
      <div
        :data-color="activeColor"
        class="flex items-center px-4 h-12 w-full sm:w-auto data-[color=white]:bg-gray-200 data-[color=black]:bg-gray-900 data-[color=white]:text-gray-900 data-[color=black]:text-gray-50 font-medium rounded-xl transition-colors ease-in-out"
      >
        {{ activeColor === PieceColor.White ? "White" : "Black" }}'s move
      </div>
      <div class="flex flex-row gap-2 w-full sm:w-auto">
        <SmallFlatSecondaryButton
          @click="emit('timeTravelRelative', -Infinity)"
          class="grow"
        >
          <SvgIcon type="mdi" :path="mdiArrowCollapseLeft" class="h-4" />
        </SmallFlatSecondaryButton>
        <SmallFlatSecondaryButton
          @click="emit('timeTravelRelative', -1)"
          class="grow"
        >
          <SvgIcon type="mdi" :path="mdiArrowLeft" class="h-4" />
        </SmallFlatSecondaryButton>
        <SmallFlatSecondaryButton
          @click="emit('timeTravelRelative', 1)"
          class="grow"
        >
          <SvgIcon type="mdi" :path="mdiArrowRight" class="h-4" />
        </SmallFlatSecondaryButton>
        <SmallFlatSecondaryButton
          @click="emit('timeTravelRelative', Infinity)"
          class="grow"
        >
          <SvgIcon type="mdi" :path="mdiArrowCollapseRight" class="h-4" />
        </SmallFlatSecondaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameHistory from "@/components/GameHistory.vue";
import type { MoveItem } from "@/lib/types";
import { PieceColor } from "@/lib/types";
import { getChessOpening } from "@/lib/chessOpenings";
import { asyncComputed } from "@vueuse/core";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiArrowCollapseLeft,
  mdiArrowLeft,
  mdiArrowRight,
  mdiArrowCollapseRight,
} from "@mdi/js";
import SmallFlatSecondaryButton from "@/components/forms/SmallFlatSecondaryButton.vue";

const props = defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  isPlayer: boolean;
  gameHasStarted: boolean;
  historyIndex: number;
  setupFen?: string;
}>();

const emit = defineEmits<{
  (event: "timeTravelRelative", payload: number): void;
  (event: "timeTravelAbsolute", payload: number): void;
}>();

const opening = asyncComputed(
  () => getChessOpening(props.moveHistory)?.name,
  null
);
</script>
