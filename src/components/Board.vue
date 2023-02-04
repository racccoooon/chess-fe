<template>
  <svg class="w-[800px] aspect-square select-none" :viewBox="`0 0 ${tileAbsoluteWidth * 8 + borderAbsoluteSize * 2} ${tileAbsoluteHeight * 8 + borderAbsoluteSize * 2}`">
    <rect width="100%" height="100%" class="fill-gray-100 dark:fill-gray-800" />
    <template v-for="i in 8" :key="i">
      <text
        :x="borderAbsoluteSize / 2"
        :y="(i - 1) * tileAbsoluteHeight + borderAbsoluteSize + 18"
        class="fill-gray-800 dark:fill-gray-100"
        font-size="20"
        font-weight="500"
        text-anchor="middle"
        dominant-baseline="middle"
        v-text="8 - i + 1"
      />
    </template>
    <template v-for="i in 8" :key="i">
      <text
        :x="i * tileAbsoluteWidth + borderAbsoluteSize - 18"
        :y="tileAbsoluteHeight * 8 + borderAbsoluteSize + borderAbsoluteSize / 2"
        class="fill-gray-800 dark:fill-gray-100"
        font-size="20"
        font-weight="500"
        text-anchor="middle"
        dominant-baseline="middle"
        v-text="String.fromCharCode(96 + i)"
      />
    </template>
    <svg :x="borderAbsoluteSize" :y="borderAbsoluteSize" :width="tileAbsoluteWidth * 8" :height="tileAbsoluteHeight * 8">
      <template v-for="x in 8" :key="x">
        <template v-for="y in 8" :key="y">
          <rect
            :x="(x - 1) * tileAbsoluteWidth"
            :y="(y - 1) * tileAbsoluteHeight"
            :width="tileAbsoluteWidth"
            :height="tileAbsoluteHeight"
            :class="['fill-green-100','fill-green-500'][(x + y) % 2]"
          />
        </template>
      </template>
      <template v-for="x in 8" :key="x">
        <template v-for="y in 2" :key="y">
          <Piece :x="x - 1" :y="y - 1" :color="'white'" :type="'pawn'"/>
          <Piece :x="x - 1" :y="y + 5" :color="'black'" :type="'pawn'" />
        </template>
      </template>
    </svg>
  </svg>
</template>

<script setup lang="ts">
import Piece from "@/components/Piece.vue";

const tileAbsoluteWidth = 100;
const tileAbsoluteHeight = 100;
const borderAbsoluteSize = 33;
</script>