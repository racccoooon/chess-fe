<template>
  <div class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-12">
    <div class="flex flex-col gap-8">
      <div class="flex justify-center">
        <h2 class="dark:text-gray-50 text-gray-900 text-xl font-bold">
          {{ opponent?.name || "Opponent hasn't joined yet..." }}
        </h2>
      </div>
      <div class="flex justify-center">
        <BoardRenderer
          :board="board"
          :reverse="reverseBoard"
          :currentMove="currentMove"
          :lastMove="lastMove"
          @click="handleClick"
        />
      </div>
      <div class="flex justify-center">
        <h2 class="dark:text-gray-50 text-gray-900 text-xl font-bold">
          {{ player?.name }} (You)
        </h2>
      </div>
      <div>
        <button
          @click="loadBoard"
          class="px-6 py-3 rounded-2xl bg-gray-700 border-b-4 border-gray-800 text-gray-50 font-medium text-lg"
        >
          loadBoard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import { getGame, joinGame } from "@/lib/api";
import { useRoute, useRouter } from "vue-router";
import type { Board, Move, PartialMove, Player } from "@/lib/types";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { get, set, useEventListener } from "@vueuse/core";
import { Piece, PieceColor, PieceType } from "@/lib/types";
import { SignalrConnection } from "@/lib/signalr";

const router = useRouter();
const hubConnection = new SignalrConnection();

const gameId = ref(useRoute().params.gameId as string);
const token = ref(window.history.state.token as string);

const board = ref<Board>({
  pieces: [],
});

// set up the default players
const player = ref<Player>({
  color: PieceColor.White,
  name: (window.history.state!.playerName as string) || "Player 1",
});
const opponent = ref<Player | null>(null);

const reverseBoard = computed(() => {
  return get(player)?.color === PieceColor.Black;
});

const lastMove = ref<Move | null>(null);
const currentMove = ref<PartialMove | null>(null);

const initialize = async () => {
  if (get(token)) {
    // if we have a token, we're the creator of the game

    // all values are already set, so we can just load the board

    // remove token and playerName from history state because they are already saved
    delete window.history.state.token;
    delete window.history.state.playerName;
  } else {
    // if we don't have a token, we're joining the game
    let res = await joinGame(get(gameId)).catch(() => {
      // if we can't join the game, redirect to start playing page
      if (import.meta.env.PROD) {
        router.push({ name: "start-playing" });
      }
    });

    if (!res) {
      return;
    }

    set(token, res.token);

    set(player, {
      name: res.playerName,
      color: PieceColor.Black,
    });

    set(opponent, {
      name: res.opponentName,
      color: PieceColor.White,
    });
  }

  await hubConnection.start();

  hubConnection.onMoveMade(async (e) => {
    let move: Move = {
      fromCell: {
        x: e.fromCell.x,
        y: e.fromCell.y,
      },
      toCell: {
        x: e.toCell!.x,
        y: e.toCell!.y,
      },
    };

    set(lastMove, move);

    makeMove(move);
  });

  hubConnection.onOpponentJoined((opponentName) => {
    set(opponent, {
      name: opponentName,
      color: PieceColor.White,
    });
  });

  await hubConnection.joinGame(get(gameId), get(token));

  await loadBoard();
};

const loadBoard = async () => {
  let game = await getGame(get(gameId), get(token));

  get(board).pieces = [];

  game.pieces?.forEach((piece) => {
    get(board).pieces.push(
      new Piece(
        piece.type as PieceType,
        piece.color as PieceColor,
        piece.x,
        piece.y
      )
    );
  });
};

const getPieceAtCell = (x: number, y: number) => {
  return get(board).pieces.find((piece) => piece.x === x && piece.y === y);
};

const makeMove = async (move: Move) => {
  let piece = getPieceAtCell(move.fromCell.x, move.fromCell.y);

  if (!piece) {
    return;
  }

  piece.x = move.toCell.x;
  piece.y = move.toCell.y;
};

onMounted(async () => {
  await initialize();
});

onBeforeMount(() => {
  useEventListener(window, "beforeunload", (event) => {
    if (import.meta.env.PROD) {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave?";
    }
  });
});

const handleClick = async (x: number, y: number) => {
  let selectedPiece = getPieceAtCell(x, y);

  if (get(currentMove) === null) {
    // if there is no piece at the selected cell, or the piece is not the player's color, do nothing
    if (
      selectedPiece === undefined ||
      selectedPiece.color !== get(player).color
    ) {
      return;
    }

    set(currentMove, {
      fromCell: { x, y },
      toCell: null,
    } as PartialMove);
  } else {
    // if the player selects a cell with a piece of their color as the target position, cancel the move
    if (selectedPiece?.color === get(player).color) {
      set(currentMove, null);
      return;
    }

    // TODO: check if the move is valid

    get(currentMove)!.toCell = { x, y };

    await hubConnection.makeMove(
      get(gameId),
      get(token),
      get(currentMove) as Move
    );

    set(lastMove, get(currentMove) as Move);
    set(currentMove, null);
  }
};
</script>
