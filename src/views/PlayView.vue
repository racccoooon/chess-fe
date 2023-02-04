<template>
  <div class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-12">
    <div class="flex flex-col gap-12">
      <div class="flex justify-center">
        <BoardRenderer :board="board" :reverse="reverseBoard" @click="handleClick" />
      </div>
      <div>
        <button @click="loadBoard" class="px-6 py-3 rounded-2xl bg-gray-700 border-b-4 border-gray-800 text-gray-50 font-medium text-lg">loadBoard</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import { getGame, joinGame, movePiece } from "@/lib/api";
import { useRoute } from "vue-router";
import type { Board, Move, PartialMove, Player } from "@/lib/types";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { get, set, useEventListener } from "@vueuse/core";
import { Piece, PieceColor, PieceType } from "@/lib/types";

const gameId = ref(useRoute().params.gameId as string);
const token = ref(window.history.state.token as string);

const board = ref<Board>({
  pieces: [],
});

const player = ref<Player | null>(null);
const opponent = ref<Player | null>(null);

const reverseBoard = computed(() => {
  return get(player)?.color === PieceColor.Black;
});

const currentMove = ref<PartialMove | null>(null);

const initialize = async () => {
  if (get(token)) {
    // if we have a token, we're the creator of the game
    set(player, {
      name: "",
      color: PieceColor.White
    });

    set(opponent, {
      name: "",
      color: PieceColor.Black
    });

    // remove token from history state
    delete window.history.state.token;
  } else {
    // if we don't have a token, we're joining the game
    let res = await joinGame(get(gameId));

    set(token, res.token);

    set(player, {
      name: res.playerName,
      color: PieceColor.Black
    });

    set(opponent, {
      name: res.opponentName,
      color: PieceColor.White
    });
  }

  await loadBoard();
};

const loadBoard = async () => {
  let game = await getGame(get(gameId), get(token))

  get(board).pieces = [];

  game.pieces?.forEach((piece) => {
    get(board).pieces.push(
      new Piece(piece.type as PieceType, piece.color as PieceColor, piece.x, piece.y)
    );
  });
};

onMounted(async () => {
  await initialize();
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

    await movePiece(get(gameId), get(token), get(currentMove) as Move).catch((error) => {
      console.log(error);
    });
    await loadBoard();

    set(currentMove, null);
  }
};
</script>