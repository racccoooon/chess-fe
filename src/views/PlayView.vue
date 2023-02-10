<template>
  <div
    class="mx-6 md:m-12 lg:my-0 lg:h-screen flex flex-col lg:flex-row gap-6 lg:gap-16 justify-center items-center"
  >
    <div
      class="flex flex-col justify-center lg:basis-5/12 xl:basis-1 w-full lg:w-auto lg:h-screen"
    >
      <div class="p-6">
        <h2 class="dark:text-gray-50 text-gray-900 text-xl font-bold">
          {{ opponent?.name || "Opponent hasn't joined yet..." }}
        </h2>
      </div>
      <div class="w-full xl:h-3/4">
        <BoardRenderer
          :board="board"
          :reverse="reverseBoard"
          :currentMove="currentMove"
          :lastMove="lastMove"
          @click="handleClick"
          class="h-full rounded-2xl"
        />
      </div>
      <div class="p-6">
        <h2 class="dark:text-gray-50 text-gray-900 text-xl font-bold">
          <input class="bg-gray-100 dark:bg-gray-800" v-model="player.name" />
        </h2>
      </div>
    </div>
    <div class="h-full flex flex-col basis-1/4 w-full lg:w-auto">
      <div class="grow lg:my-16 p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <GameHistory :moveHistory="moveHistory" />
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
  MoveItem,
  PartialMove,
  Player,
} from "@/lib/types";
import { MoveType, Piece, PieceColor, PieceType } from "@/lib/types";
import { computed, onMounted, ref, watch } from "vue";
import { get, set } from "@vueuse/core";
import { SignalrConnection } from "@/lib/signalr";
import { usePlayerStore } from "@/stores/player";
import { getSquareName } from "@/lib/chessNotation";
import GameHistory from "@/components/GameHistory.vue";

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

const moveHistory = ref<MoveItem[]>([]);

const lastMove = computed(() => {
  return get(moveHistory)[get(moveHistory).length - 1] || null;
});
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

    // set move history
    set(moveHistory, e.moves);

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

  hubConnection.onMove(async (e: Partial<MoveItem>) => {
    // add promoteToType to the move
    // even if a move is a promotion, the server will not send the promotion with the onMove event
    // we will set promotion to its real value later
    const move = {
      ...e,
      promoteToType: null,
    } as MoveItem;

    resolveMove(move);
  });

  // join the game
  await hubConnection.joinGame(get(gameId), get(token)!, get(player).name);
};

const getPieceAtCell = (x: number, y: number) => {
  return get(board).pieces.find((piece) => piece.x === x && piece.y === y);
};

const resolveMove = (move: MoveItem) => {
  console.log("resolving move", move);

  // get the piece at the form cell
  let pieceToMove = getPieceAtCell(move.from.x, move.from.y);

  // get the piece at the to cell
  let pieceToTake = getPieceAtCell(move.to.x, move.to.y);

  if (move.kind === MoveType.EnPassant) {
    // if the move is en passant, remove the piece that was taken
    pieceToTake = getPieceAtCell(move.to.x, move.from.y);
  }

  if (!pieceToMove) {
    throw new Error(
      `Cannot move piece that does not exist! ${move.color} ${
        move.type
      } at ${getSquareName(move.from.x, move.from.y)} to ${getSquareName(
        move.to.x,
        move.to.y
      )} (${move.kind})`
    );
  }

  // if there is a piece to take, remove it from the board
  if (pieceToTake) {
    if (!pieceToTake) {
      throw new Error(
        `Cannot take piece that does not exist! ${move.color} ${
          move.type
        } at ${getSquareName(move.from.x, move.from.y)} to ${getSquareName(
          move.to.x,
          move.to.y
        )} (${move.kind})`
      );
    }
    get(board).pieces = get(board).pieces.filter((p) => p !== pieceToTake);
  }

  // move the piece to its new position
  pieceToMove.x = move.to.x;
  pieceToMove.y = move.to.y;

  // push the move to the move history
  get(moveHistory).push(move);

  // change the active color
  set(
    activeColor,
    move.color === PieceColor.White ? PieceColor.Black : PieceColor.White
  );
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
      from: { x, y },
      to: null,
    } as PartialMove);
  } else {
    // if the player selects a cell with a piece of their color as the target position, cancel the move
    if (selectedPiece?.color === get(player).color) {
      set(currentMove, null);
      return;
    }

    // TODO: check if the move is valid

    // complete current move
    get(currentMove)!.to = { x, y };

    console.log("sending move", get(currentMove));

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
