<template>
  <PawnSvgFlat v-if="type === PieceType.Pawn" :color="color" />
  <RookSvgFlat v-else-if="type === PieceType.Rook" :color="color" />
  <KingSvgFlat v-else-if="type === PieceType.King" :color="color" />
  <QueenSvgFlat v-else-if="type === PieceType.Queen" :color="color" />
  <BishopSvgFlat v-else-if="type === PieceType.Bishop" :color="color" />
  <KnightSvgFlat v-else-if="type === PieceType.Knight" :color="color" />
</template>

<script setup lang="ts">
import { PieceColor, PieceType } from "@/lib/types";
import PawnSvgFlat from "@/components/pieces/flat/PawnSvgFlat.vue";
import RookSvgFlat from "@/components/pieces/flat/RookSvgFlat.vue";
import KingSvgFlat from "@/components/pieces/flat/KingSvgFlat.vue";
import QueenSvgFlat from "@/components/pieces/flat/QueenSvgFlat.vue";
import BishopSvgFlat from "@/components/pieces/flat/BishopSvgFlat.vue";
import KnightSvgFlat from "@/components/pieces/flat/KnightSvgFlat.vue";

defineProps<{
  color: PieceColor;
  type: PieceType;
}>();
</script>
