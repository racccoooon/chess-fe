<template>
  <div class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-12">
    <div class="flex justify-center">
      <BoardRenderer :board="board" :reverse="reverseBoard" @click="handleClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import { getGame, movePiece } from "@/lib/api";
import { useRoute } from "vue-router";
import type { Board, Move, PartialMove } from "@/lib/types";
import { onBeforeMount, onMounted, ref } from "vue";
import { get, set, useEventListener } from "@vueuse/core";
import { Piece, PieceColor, PieceType } from "@/lib/types";

const gameId = useRoute().params.gameId as string;
const token = window.history.state.token as string;

const board = ref<Board>({
  pieces: [],
});

const reverseBoard = ref(false);

const currentMove = ref<PartialMove | null>(null);

const loadBoard = async () => {
  let game = await getGame(gameId, token)

  get(board).pieces = [];

  game.pieces?.forEach((piece) => {
    get(board).pieces.push(
      new Piece(piece.type as PieceType, piece.color as PieceColor, piece.x, piece.y)
    );
  });
};

onMounted(async () => {
  await loadBoard();
});

onBeforeMount(() => {
  useEventListener(window,"beforeunload", event => {
    if (import.meta.env.PROD) {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave?";
    }
  })
});

const handleClick = async (x: number, y: number) => {
  let move = get(currentMove);

  if (move === null) {
    move = {
      fromCell: { x, y },
      toCell: null,
    } as PartialMove;

    set(currentMove, move);

    console.log("starting move...", get(currentMove));
  } else {
    move.toCell = { x, y };

    set(currentMove, move);

    console.log("completing move...", get(currentMove));

    await movePiece(gameId, token, get(currentMove) as Move).catch((error) => {
      console.log(error);
    });
    await loadBoard();

    set(currentMove, null);
  }
};
</script>