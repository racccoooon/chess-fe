<template>
  <svg viewBox="0 0 100 100">
    <AnyPieceSvgModern
      v-if="set === PieceSet.Modern || !set"
      :color="color"
      :type="type"
    />
    <AnyPieceSvgFlat
      v-else-if="set === PieceSet.Flat"
      :color="color"
      :type="type"
    />
    <AnyPieceSvgRaccoon
      v-else-if="set === PieceSet.Raccoon"
      :color="color"
      :type="type"
    />
    <AnyPieceSvgClassic
      v-else-if="set === PieceSet.Classic"
      :color="color"
      :type="type"
    />
    <AnyPieceSvgObfuscated
      v-else-if="set === PieceSet.Obfuscated"
      :color="color"
      :type="type"
    />
    <template v-else-if="set !== PieceSet.Blindfold">
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
import { PieceColor, PieceSet, PieceType } from "@/lib/types";
import AnyPieceSvgModern from "@/components/pieces/modern/AnyPieceSvgModern.vue";
import AnyPieceSvgRaccoon from "@/components/pieces/raccoon/AnyPieceSvgRaccoon.vue";
import AnyPieceSvgClassic from "@/components/pieces/classic/AnyPieceSvgClassic.vue";
import AnyPieceSvgFlat from "@/components/pieces/flat/AnyPieceSvgFlat.vue";
import AnyPieceSvgObfuscated from "@/components/pieces/obfuscated/AnyPieceSvgObfuscated.vue";

defineProps<{
  color: PieceColor;
  type: PieceType;
  set?: PieceSet;
}>();
</script>
