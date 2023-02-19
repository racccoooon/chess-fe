<template>
  <PawnSvgModern v-if="type === PieceType.Pawn" :color="color" />
  <RookSvgModern v-else-if="type === PieceType.Rook" :color="color" />
  <KingSvgModern v-else-if="type === PieceType.King" :color="color" />
  <QueenSvgModern v-else-if="type === PieceType.Queen" :color="color" />
  <BishopSvgModern v-else-if="type === PieceType.Bishop" :color="color" />
  <KnightSvgModern v-else-if="type === PieceType.Knight" :color="color" />
</template>

<script setup lang="ts">
import PawnSvgModern from "@/components/pieces/modern/PawnSvgModern.vue";
import RookSvgModern from "@/components/pieces/modern/RookSvgModern.vue";
import KingSvgModern from "@/components/pieces/modern/KingSvgModern.vue";
import QueenSvgModern from "@/components/pieces/modern/QueenSvgModern.vue";
import BishopSvgModern from "@/components/pieces/modern/BishopSvgModern.vue";
import KnightSvgModern from "@/components/pieces/modern/KnightSvgModern.vue";
import { PieceColor, PieceType } from "@/lib/types";

defineProps<{
  color: PieceColor;
  type: PieceType;
}>();
</script>
