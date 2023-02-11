<template>
  <svg viewBox="0 0 100 100">
    <RaccoonTail
      v-if="useRaccoonTail"
      :color="color"
      :flipped="type === PieceType.Knight"
    />
    <template v-if="type === PieceType.Pawn">
      <RaccoonPawnIcon v-if="useRaccoonPawn" :color="color" />
      <PawnIcon v-else :color="color" />
    </template>
    <RookIcon v-else-if="type === PieceType.Rook" :color="color" />
    <KingIcon v-else-if="type === PieceType.King" :color="color" />
    <QueenIcon v-else-if="type === PieceType.Queen" :color="color" />
    <BishopIcon v-else-if="type === PieceType.Bishop" :color="color" />
    <KnightIcon v-else-if="type === PieceType.Knight" :color="color" />
    <template v-else>
      <text
        x="50%"
        y="50%"
        class="fill-gray-100 stroke-[8px] stroke-gray-900"
        font-size="24"
        font-weight="500"
        text-anchor="middle"
        dominant-baseline="middle"
        v-text="type"
      />
      <text
        x="50%"
        y="50%"
        class="fill-gray-100"
        font-size="24"
        font-weight="500"
        text-anchor="middle"
        dominant-baseline="middle"
        v-text="type"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { PieceColor, PieceType } from "@/lib/types";
import PawnIcon from "@/components/pieces/PawnIcon.vue";
import RookIcon from "@/components/pieces/RookIcon.vue";
import KingIcon from "@/components/pieces/KingIcon.vue";
import QueenIcon from "@/components/pieces/QueenIcon.vue";
import RaccoonTail from "@/components/pieces/RaccoonTail.vue";
import BishopIcon from "@/components/pieces/BishopIcon.vue";
import KnightIcon from "@/components/pieces/KnightIcon.vue";
import RaccoonPawnIcon from "@/components/pieces/RaccoonPawnIcon.vue";

defineProps<{
  color: PieceColor;
  type: PieceType;
  useRaccoonTail?: boolean;
  useRaccoonPawn?: boolean;
}>();
</script>
