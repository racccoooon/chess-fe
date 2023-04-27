<template>
  <div class="flex flex-col gap-44 lg:gap-10 lg:w-96">
    <div class="flex flex-col gap-2 items-center relative my-6">
      <PieceRenderer
        :color="PieceColor.White"
        :type="PieceType.King"
        class="absolute h-24 bottom-20"
      />
      <h2 class="font-extrabold text-3xl">You Won!</h2>
      <p class="text-gray-500 text-sm">by checkmating your opponent</p>
    </div>
    <div class="flex flex-col gap-4">
      <LargeFlatSecondaryButton class="w-full" href="/">
        Analise game
      </LargeFlatSecondaryButton>
      <LargePrimaryButton @click="dismiss" class="w-full" href="/">
        Create A New Game
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
import { PieceColor, PieceType } from "@/lib/types";

const emits = defineEmits<{
  (event: "dismissed"): void;
}>();

const dismiss = () => {
  emits("dismissed");
};
</script>
