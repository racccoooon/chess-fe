<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col items-center">
      <h2 class="font-bold text-lg">Promote Pawn</h2>
    </div>
    <div class="flex flex-wrap sm:flex-row gap-4 justify-center">
      <button
        @click="selectType(PieceType.Queen)"
        class="flex items-center justify-center p-2 md:w-24 md:h-24 rounded-xl bg-gray-200 dark:bg-gray-700"
      >
        <PieceRenderer
          class="w-12 h-12"
          :color="PieceColor.White"
          :type="PieceType.Queen"
        />
      </button>
      <button
        @click="selectType(PieceType.Rook)"
        class="flex items-center justify-center p-2 md:w-24 md:h-24 rounded-xl bg-gray-200 dark:bg-gray-700"
      >
        <PieceRenderer
          class="w-14"
          :color="PieceColor.White"
          :type="PieceType.Rook"
        />
      </button>
      <button
        @click="selectType(PieceType.Bishop)"
        class="flex items-center justify-center p-2 md:w-24 md:h-24 rounded-xl bg-gray-200 dark:bg-gray-700"
      >
        <PieceRenderer
          class="w-14"
          :color="PieceColor.White"
          :type="PieceType.Bishop"
        />
      </button>
      <button
        @click="selectType(PieceType.Knight)"
        class="flex items-center justify-center p-2 md:w-24 md:h-24 rounded-xl bg-gray-200 dark:bg-gray-700"
      >
        <PieceRenderer
          class="w-14"
          :color="PieceColor.White"
          :type="PieceType.Knight"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";
import { PieceColor, PieceType } from "@/lib/types";
import type { PromotionSelectedEvent } from "@/lib/types";

const emits = defineEmits<{
  (event: "select-type", payload: PromotionSelectedEvent): void;
}>();

const selectType = (type: PieceType) => {
  emits("select-type", { type });
};
</script>
