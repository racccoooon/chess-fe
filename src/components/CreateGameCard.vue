<template>
  <div class="p-6 md:p-12 lg:p-16 bg-gray-100 dark:bg-gray-800 md:rounded-3xl">
    <div class="flex flex-col gap-8 lg:gap-12">
      <LargePrimaryButton class="w-full" @click="createGame">
        Start Playing <SvgIcon type="mdi" :path="mdiArrowRight" />
      </LargePrimaryButton>
      <div class="flex flex-col gap-6">
        <h2 class="text-xl font-bold">You play as</h2>
        <LargeOptionsGroup
          v-model="startColor"
          :options="[
            { label: 'White', value: GameStartColor.White },
            { label: 'Black', value: GameStartColor.Black },
            { label: 'Random', value: GameStartColor.Random },
          ]"
        >
          <template #preview="option">
            <PieceRenderer
              v-if="
                option.value === GameStartColor.White ||
                option.value === GameStartColor.Black
              "
              :color="
                option.value === GameStartColor.White
                  ? PieceColor.White
                  : PieceColor.Black
              "
              :type="PieceType.Pawn"
              class="w-12"
            />
            <span v-else>
              <PieceRenderer
                :color="PieceColor.White"
                :type="PieceType.Pawn"
                class="absolute w-12 masked"
              />
              <PieceRenderer
                :color="PieceColor.Black"
                :type="PieceType.Pawn"
                class="w-12"
              />
            </span>
          </template>
        </LargeOptionsGroup>
      </div>
      <div class="flex flex-col gap-6">
        <h2 class="text-xl font-bold">Chess Variation</h2>
        <LargeOptionsGroup
          v-model="variation"
          :options="[
            {
              label: 'Standard Chess',
              description: 'The classic chess experience',
              value: ChessVariation.Standard,
            },
            {
              label: 'Chess960',
              description: 'Pieces are shuffled each game',
              value: ChessVariation.Chess960,
            },
            {
              label: 'Horde',
              description: 'White plays with 36 pawns',
              value: ChessVariation.Horde,
            },
            {
              label: 'Atheist Chess',
              description: 'Bishops are pawns',
              value: ChessVariation.Atheist,
            },
            {
              label: 'Custom',
              description: 'Choose the starting position',
              value: ChessVariation.Custom,
            },
          ]"
        >
        </LargeOptionsGroup>
      </div>
      <div
        class="flex flex-col gap-6"
        v-if="variation === ChessVariation.Custom"
      >
        <h2 class="text-xl font-bold">Custom Game Settings</h2>
        <div class="flex flex-col gap-3">
          <h3 class="text-lg font-medium">Starting Fen</h3>
          <LargeTextInput v-model="customFen" />
        </div>
        <div class="flex flex-col gap-3">
          <h3 class="text-lg font-medium">Starting Color</h3>
          <SmallOptionsGroup
            v-model="startingColor"
            :options="[
              { label: 'White', value: PieceColor.White },
              { label: 'Black', value: PieceColor.Black },
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LargePrimaryButton from "@/components/forms/LargePrimaryButton.vue";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiArrowRight } from "@mdi/js";
import LargeOptionsGroup from "@/components/forms/LargeOptionsGroup.vue";
import type { Piece } from "@/lib/types";
import {
  ChessVariation,
  GameStartColor,
  PieceColor,
  PieceType,
} from "@/lib/types";
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";
import { ref } from "vue";
import { createGame as createGameApi } from "@/lib/api";
import { get } from "@vueuse/core";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { fenToPieces } from "@/lib/chess";
import LargeTextInput from "@/components/forms/LargeTextInput.vue";
import SmallOptionsGroup from "@/components/forms/SmallOptionsGroup.vue";

const store = useUserStore();

const { name: playerName } = store;

const router = useRouter();

const startColor = ref(GameStartColor.White);

const variation = ref(ChessVariation.Standard);

const customFen = ref("");
const startingColor = ref(PieceColor.White);

const randomizedRow = (row: string) => {
  return row
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

const createGame = async () => {
  let startingPieces: Piece[] = [];

  switch (get(variation)) {
    case ChessVariation.Chess960:
      startingPieces = fenToPieces(
        `${randomizedRow("rnbqkbnr")}/pppppppp/8/8/8/8/PPPPPPPP/${randomizedRow(
          "RNBQKBNR"
        )}`
      );
      break;
    case ChessVariation.Horde:
      startingPieces = fenToPieces(
        "rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP"
      );
      break;
    case ChessVariation.Atheist:
      startingPieces = fenToPieces(
        "rnpqkpnr/pppppppp/8/8/8/8/PPPPPPPP/RNPQKPNR"
      );
      break;
    case ChessVariation.Custom:
      startingPieces = fenToPieces(get(customFen));
      break;
  }

  let game = await createGameApi(
    get(startColor),
    startingPieces,
    get(variation) === ChessVariation.Custom
      ? get(startingColor)
      : PieceColor.White,
    true
  );

  store.$patch({
    name: get(playerName),
  });

  await router.push({
    name: "play",
    params: { gameId: game.gameId },
  });
};
</script>

<style scoped>
.masked {
  mask-image: linear-gradient(
    -202.5deg,
    black 0%,
    black 50%,
    transparent 50%,
    transparent 100%
  );
  mask-size: 100%;
  mask-repeat: no-repeat;
  mask-position: center;
}
</style>
