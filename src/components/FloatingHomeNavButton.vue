<template>
  <RouterLink
    :to="{ name: 'home' }"
    class="flex justify-center sm:fixed sm:top-0 sm:left-0 mt-6 sm:m-4 sm:p-4 hover:px-6 group sm:hover:bg-gray-100 sm:hover:dark:bg-gray-800 rounded-2xl transition-all ease-in-out duration-200"
  >
    <PieceRenderer
      class="hidden sm:block sm:absolute h-6 opacity-75 group-hover:opacity-0 transition-all ease-in-out duration-200"
      :color="PieceColor.White"
      :type="PieceType.Pawn"
    />
    <div
      class="h-8 sm:h-6 sm:w-12 sm:group-hover:w-32 overflow-x-hidden sm:opacity-0 sm:group-hover:opacity-100 transition-all ease-in-out"
    >
      <RaccoonChessLogo class="h-6 w-32" />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";
import RaccoonChessLogo from "@/components/icons/RaccoonChessLogo.vue";
import { PieceColor, PieceType } from "@/lib/types";
</script>
