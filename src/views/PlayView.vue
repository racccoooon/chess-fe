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
          <input class="bg-gray-100 dark:bg-gray-800" v-model="player.name" />
          (You)
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import { useRoute, useRouter } from "vue-router";
import type {
  Board,
  GameStartedResponse,
  JoinGameResponse,
  Move,
  PartialMove,
  Player,
} from "@/lib/types";
import { computed, onMounted, ref, watch } from "vue";
import { get, set } from "@vueuse/core";
import { Piece, PieceColor, PieceType } from "@/lib/types";
import { SignalrConnection } from "@/lib/signalr";
import { usePlayerStore } from "@/stores/player";

const router = useRouter();
const hubConnection = new SignalrConnection();

const store = usePlayerStore();

const gameId = ref(useRoute().params.gameId as string);
const token = store.token;

const board = ref<Board>({
  pieces: [],
});

// set up the default players
const player = ref<Player>({
  color: PieceColor.White,
  name: ref(store.name),
});
const opponent = ref<Player | null>(null);

// update the store when the player name changes
watch(
  () => get(player).name,
  (newName) => {
    store.$patch({ name: newName });
  }
);

const reverseBoard = computed(() => {
  return get(player)?.color === PieceColor.Black;
});

const lastMove = ref<Move | null>(null);
const currentMove = ref<PartialMove | null>(null);

const activeColor = ref<PieceColor>(PieceColor.White);

const canMove = computed(() => {
  if (get(opponent) === null) {
    return false;
  }
  return get(activeColor) === get(player).color;
});

const initialize = async () => {
  // initialize the signalr connection and register the event handlers
  await hubConnection.start();

  hubConnection.onGameFull(() => {
    alert("Game is full!");
    router.push({ name: "start-playing" });
  });

  hubConnection.onGameNotFound(() => {
    alert("Game not found!");
    router.push({ name: "start-playing" });
  });

  hubConnection.onPlayerNotFound(() => {
    alert("Player not found!");
    router.push({ name: "start-playing" });
  });

  hubConnection.onInvalidMove(() => {
    alert("Invalid move!");
  });

  hubConnection.onGameJoined((e: JoinGameResponse) => {
    // the game joined event means we successfully joined the game as a player
    // we need to set up the board and player color
    // the opponent may or may not have joined yet

    // setup board
    e.board.forEach((piece) => {
      get(board).pieces.push(
        new Piece(
          piece.type as PieceType,
          piece.color as PieceColor,
          piece.position.x,
          piece.position.y
        )
      );
    });

    // set player color
    get(player).color = e.playerColor as PieceColor;

    // set opponent if they already joined before us
    if (e.opponentName) {
      set(opponent, {
        name: e.opponentName,
        color:
          e.playerColor === PieceColor.White
            ? PieceColor.Black
            : PieceColor.White,
      });
    }

    // set active color
    set(activeColor, e.activeColor as PieceColor);
  });

  hubConnection.onGameStarted((e: GameStartedResponse) => {
    // the game started event means the opponent joined

    // get opponent color based on player color
    let opponentColor =
      get(player).color === PieceColor.White
        ? PieceColor.Black
        : PieceColor.White;

    // set opponent
    set(opponent, {
      name:
        opponentColor === PieceColor.White
          ? e.whitePlayerName
          : e.blackPlayerName,
      color: opponentColor,
    });
  });

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

    resolveMove(move);
  });

  // join the game
  await hubConnection.joinGame(get(gameId), get(token)!, get(player).name);
};

const getPieceAtCell = (x: number, y: number) => {
  return get(board).pieces.find((piece) => piece.x === x && piece.y === y);
};

const resolveMove = async (move: Move) => {
  let piece = getPieceAtCell(move.fromCell.x, move.fromCell.y);

  if (!piece) {
    return;
  }

  piece.x = move.toCell.x;
  piece.y = move.toCell.y;
};

const handleClick = async (x: number, y: number) => {
  if (!get(canMove)) {
    set(currentMove, null);
    return;
  }

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

    // complete current move
    get(currentMove)!.toCell = { x, y };

    // send move to server
    await hubConnection.makeMove(get(gameId), get(currentMove) as Move);

    set(lastMove, get(currentMove) as Move);
    set(currentMove, null);
  }
};

onMounted(async () => {
  await initialize();
});
</script>
