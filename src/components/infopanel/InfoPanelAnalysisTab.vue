<template>
  <div
    class="grow flex flex-col-reverse sm:flex-col gap-8 justify-between h-min"
  >
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
        :setup-fen="setupFen"
        :game-result="gameResult"
        @time-travel-absolute="emit('timeTravelAbsolute', $event)"
      />
      <div>
        <TinyFlatSecondaryButton
          @click="
            emit('continueFromHistoryIndex', 0);
            pause();
          "
          v-if="historyIndex === 0 && moveHistory.length > 0"
        >
          <SvgIcon type="mdi" :path="mdiTrashCanOutline" class="h-4" />
          <span>Undo all moves</span>
        </TinyFlatSecondaryButton>
        <TinyFlatSecondaryButton
          @click="
            emit('continueFromHistoryIndex', historyIndex - 1);
            pause();
          "
          v-else-if="
            historyIndex === moveHistory.length && moveHistory.length > 0
          "
        >
          <SvgIcon type="mdi" :path="mdiUndoVariant" class="h-4" />
          <span>Undo last move</span>
        </TinyFlatSecondaryButton>
        <TinyFlatSecondaryButton
          @click="
            emit('continueFromHistoryIndex', historyIndex);
            pause();
          "
          v-else-if="historyIndex > 0 && moveHistory.length > 0"
        >
          <SvgIcon type="mdi" :path="mdiUndoVariant" class="h-4" />
          <span>
            Continue from move {{ Math.round(historyIndex / 2)
            }}{{ historyIndex % 2 !== 0 ? "." : "..." }}
          </span>
        </TinyFlatSecondaryButton>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap sm:flex-nowrap gap-2">
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
          class="grow order-last sm:order-none"
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
import type { PieceColor } from "@/lib/types";
import { getChessOpening } from "@/lib/chessOpenings";
import { asyncComputed, useIntervalFn } from "@vueuse/core";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiTrashCanOutline,
  mdiUndoVariant,
  mdiArrowCollapseLeft,
  mdiArrowLeft,
  mdiPlay,
  mdiPause,
  mdiArrowRight,
  mdiArrowCollapseRight,
} from "@mdi/js";
import SmallFlatSecondaryButton from "@/components/forms/SmallFlatSecondaryButton.vue";
import TinyFlatSecondaryButton from "@/components/forms/TinyFlatSecondaryButton.vue";

const props = defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  historyIndex: number;
  setupFen?: string;
  gameResult?: string;
}>();

const emit = defineEmits<{
  (event: "timeTravelRelative", payload: number): void;
  (event: "timeTravelAbsolute", payload: number): void;
  (event: "continueFromHistoryIndex", payload: number): void;
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
