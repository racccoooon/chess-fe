<template>
  <div class="grow flex flex-col gap-8 justify-between">
    <div class="flex flex-col gap-6">
      <div
        class="text-gray-400 dark:text-gray-500 font-medium text-sm"
        v-if="opening"
      >
        {{ opening }}
      </div>
      <GameHistory
        :moveHistory="moveHistory"
        :history-index="historyIndex"
        @time-travel-absolute="emit('timeTravelAbsolute', $event)"
      />
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2">
        <SmallFlatSecondaryButton
          @click="
            emit('timeTravelRelative', -Infinity);
            pause();
          "
          class="grow"
        >
          <SvgIcon type="mdi" :path="mdiArrowCollapseLeft" class="h-4" />
        </SmallFlatSecondaryButton>
        <SmallFlatSecondaryButton
          @click="
            emit('timeTravelRelative', -1);
            pause();
          "
          class="grow"
        >
          <SvgIcon type="mdi" :path="mdiArrowLeft" class="h-4" />
        </SmallFlatSecondaryButton>
        <SmallFlatSecondaryButton
          @click="isActive ? pause() : resume()"
          class="grow"
        >
          <SvgIcon
            type="mdi"
            :path="isActive ? mdiPause : mdiPlay"
            class="h-4"
          />
        </SmallFlatSecondaryButton>
        <SmallFlatSecondaryButton
          @click="
            emit('timeTravelRelative', 1);
            pause();
          "
          class="grow"
        >
          <SvgIcon type="mdi" :path="mdiArrowRight" class="h-4" />
        </SmallFlatSecondaryButton>
        <SmallFlatSecondaryButton
          @click="
            emit('timeTravelRelative', Infinity);
            pause();
          "
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
import { asyncComputed, useIntervalFn } from "@vueuse/core";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiArrowCollapseLeft,
  mdiArrowLeft,
  mdiPlay,
  mdiPause,
  mdiArrowRight,
  mdiArrowCollapseRight,
} from "@mdi/js";
import SmallFlatSecondaryButton from "@/components/forms/SmallFlatSecondaryButton.vue";

const props = defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  historyIndex: number;
}>();

const emit = defineEmits<{
  (event: "timeTravelRelative", payload: number): void;
  (event: "timeTravelAbsolute", payload: number): void;
}>();

const { pause, resume, isActive } = useIntervalFn(
  () => {
    emit("timeTravelRelative", 1);
    if (props.historyIndex >= props.moveHistory.length - 1) {
      pause();
    }
  },
  1000,
  { immediate: false }
);

const opening = asyncComputed(
  () => getChessOpening(props.moveHistory)?.name,
  null
);
</script>
