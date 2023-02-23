<template>
  <g transform="scale(2.5 2.5) translate(-2.5, -2.5)">
    <PawnSvgClassic v-if="type === PieceType.Pawn" :color="color" />
    <RookSvgClassic v-else-if="type === PieceType.Rook" :color="color" />
    <KingSvgClassic v-else-if="type === PieceType.King" :color="color" />
    <QueenSvgClassic v-else-if="type === PieceType.Queen" :color="color" />
    <BishopSvgClassic v-else-if="type === PieceType.Bishop" :color="color" />
    <KnightSvgClassic v-else-if="type === PieceType.Knight" :color="color" />
  </g>
</template>

<script setup lang="ts">
import PawnSvgClassic from "@/components/pieces/classic/PawnSvgClassic.vue";
import RookSvgClassic from "@/components/pieces/classic/RookSvgClassic.vue";
import KingSvgClassic from "@/components/pieces/classic/KingSvgClassic.vue";
import QueenSvgClassic from "@/components/pieces/classic/QueenSvgClassic.vue";
import BishopSvgClassic from "@/components/pieces/classic/BishopSvgClassic.vue";
import KnightSvgClassic from "@/components/pieces/classic/KnightSvgClassic.vue";
import { PieceColor, PieceType } from "@/lib/types";

defineProps<{
  color: PieceColor;
  type: PieceType;
}>();
</script>
