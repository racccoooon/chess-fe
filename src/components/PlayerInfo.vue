<template>
  <div class="p-6 flex flex-row gap-2">
    <h2 class="text-gray-900 dark:text-gray-50 text-xl font-bold">
      {{ name || "Player" }}
    </h2>
    <div class="flex flex-row gap-4 items-center">
      <div class="flex flex-row gap-4 items-center">
        <template v-for="type in pieceTypes" :key="type">
          <div
            v-if="capturedPieces[type] > 0"
            class="flex flex-row -gap-2 items-center h-5"
          >
            <span v-for="i in capturedPieces[type]" :key="i" class="w-2 h-4">
              <PieceRenderer
                class="w-5 h-5"
                :type="type"
                :color="invertColor(color)"
              />
            </span>
          </div>
        </template>
      </div>
      <span
        v-if="materialAdvantage > 0"
        class="text-gray-500 font-medium"
        v-text="`+${materialAdvantage}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PieceColor, PieceType } from "@/lib/types";
import PieceRenderer from "@/components/PieceRenderer.vue";
import { invertColor } from "@/lib/chess";
import { computed } from "vue";

const props = defineProps<{
  name: string;
  materialAdvantage: number;
  color: PieceColor;
  capturedPieces: Record<PieceType, number>;
}>();

const pieceTypes = computed(
  () => Object.keys(props.capturedPieces) as PieceType[]
);
</script>
