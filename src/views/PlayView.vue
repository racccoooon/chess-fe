<template>
  <div class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-12">
    <div class="flex justify-center">
      <BoardRenderer :board="board"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import { getGame } from "@/lib/api";
import { useRoute } from "vue-router";
import type { Board } from "@/lib/types";
import { onBeforeMount, ref } from "vue";
import { get, useEventListener } from "@vueuse/core";
import { Piece, PieceColor, PieceType } from "@/lib/types";

const gameId = useRoute().params.id as string;

const board = ref<Board>({
  pieces: [],
});

getGame(gameId).then((res) => {
  res.pieces?.forEach((piece) => {
    get(board).pieces.push(
      new Piece(piece.type as PieceType, piece.color as PieceColor, piece.x, piece.y)
    );
  });
});

onBeforeMount(() => {
  useEventListener(window,"beforeunload", event => {
    if (import.meta.env.PROD) {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave?";
    }
  })
})
</script>