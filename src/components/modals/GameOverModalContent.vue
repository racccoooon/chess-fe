<template>
  <div class="flex flex-col gap-6 lg:gap-10 lg:w-96">
    <div class="flex flex-col gap-2 items-center relative md:my-6">
      <PieceRenderer
        :color="PieceColor.White"
        :type="PieceType.King"
        class="absolute h-24 bottom-20 hidden sm:block"
        :class="{ 'rotate-[58deg] translate-y-2 translate-x-2': !hasWon }"
      />
      <h2 class="font-extrabold text-3xl">{{ headingText }}</h2>
      <p class="text-gray-500 text-sm">{{ subText }}</p>
    </div>
    <div class="flex flex-col gap-4">
      <LargeFlatSecondaryButton
        @click="dismiss"
        class="w-full"
        :to="{ name: 'home' }"
      >
        Create A New Game
      </LargeFlatSecondaryButton>
      <LargePrimaryButton
        class="w-full"
        :to="permanentLinkTo"
        v-if="moveHistory"
      >
        Analyse game
      </LargePrimaryButton>
      <button
        class="text-gray-400 dark:text-gray-600 text-sm underline"
        @click="dismiss"
      >
        dismiss
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LargePrimaryButton from "@/components/forms/LargePrimaryButton.vue";
import LargeFlatSecondaryButton from "@/components/forms/LargeFlatSecondaryButton.vue";
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";
import { GameResult, PieceColor, PlayerColor, PieceType } from "@/lib/types";
import type { MoveItem } from "@/lib/types";
import { computed } from "vue";
import { get } from "@vueuse/core";
import { getGameNotation, NotationType } from "@/lib/chessNotation";

const props = defineProps<{
  isPlayer: boolean;
  playerColor?: PlayerColor;
  gameResult: GameResult;
  whitePlayerName: string;
  blackPlayerName: string;
  setupFen?: string;
  moveHistory?: MoveItem[];
}>();

const emits = defineEmits<{
  (event: "dismissed"): void;
}>();

const dismiss = () => {
  emits("dismissed");
};

const hasWon = computed(() => {
  if (!props.isPlayer) return true;

  if (props.playerColor === PlayerColor.White) {
    return props.gameResult === GameResult.WhiteWins;
  } else {
    return props.gameResult === GameResult.BlackWins;
  }
});

const headingText = computed(() => {
  if (props.gameResult === GameResult.Draw) {
    return "Draw!";
  }

  if (props.isPlayer) {
    if (get(hasWon)) {
      return "You Won!";
    } else {
      return "You Lost!";
    }
  } else {
    if (props.gameResult === GameResult.WhiteWins) {
      return `${props.whitePlayerName} Won!`;
    } else if (props.gameResult === GameResult.BlackWins) {
      return `${props.blackPlayerName} Won!`;
    }
  }

  return "Game has ended!";
});

const subText = computed(() => {
  if (props.gameResult === GameResult.WhiteWins) {
    return `against ${props.blackPlayerName}`;
  } else if (props.gameResult === GameResult.BlackWins) {
    return `against ${props.whitePlayerName}`;
  }

  return "";
});

const permanentLinkTo = computed(() => {
  if (!props.moveHistory) return "";

  const notation = getGameNotation(
    props.moveHistory,
    NotationType.Algebraic,
    false
  );

  const san = notation.split(" ").join("/");

  return {
    name: "sandbox-board",
    query: {
      white: props.whitePlayerName,
      black: props.blackPlayerName,
      fen: props.setupFen,
      moves: san,
    },
  };
});
</script>
