<template>
  <GameLayout
    :board="board"
    :move-history="moveHistory"
    :reverse-board="reverseBoard"
    :active-color="activeColor"
    :is-player="true"
    :can-move="playerCanMove"
    :player-color="playerColor"
    :game-has-started="gameHasStarted"
    :white-player-name="whitePlayerName"
    :black-player-name="blackPlayerName"
    :highlight-squares="highlightSquares"
    @piece-selected="onPieceSelected"
    @piece-deselected="onPieceDeselected"
    @piece-moved="onPieceMoved"
  >
    <template #board-overlay>
      <SuperDuperModal v-if="showModal !== ModalType.None">
        <PromoteModalContent
          v-if="showModal === ModalType.Promotion"
          @select-type="onPromotionSelected"
        />
      </SuperDuperModal>
    </template>
  </GameLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import type {
  Board,
  BoardHighlightSquare,
  Cell,
  GameStartedResponse,
  JoinGameResponse,
  Move,
  MoveItem,
  PieceMovedEvent,
  PieceSelectedEvent,
  PromotionSelectedEvent,
} from "@/lib/types";
import {
  HighlightColor,
  HighlightShape,
  ModalType,
  MoveType,
  Piece,
  PieceColor,
  PieceType,
} from "@/lib/types";
import { computed, onMounted, ref, watch } from "vue";
import { get, set } from "@vueuse/core";
import { SignalrConnection } from "@/lib/signalr";
import { useUserStore } from "@/stores/user";
import { getSquareName } from "@/lib/chessNotation";
import { invertColor } from "@/lib/chess";
import GameLayout from "@/components/GameLayout.vue";
import SuperDuperModal from "@/components/modals/SuperDuperModal.vue";
import PromoteModalContent from "@/components/modals/PromoteModalContent.vue";

const router = useRouter();
const hubConnection = new SignalrConnection();

const userStore = useUserStore();

const gameId = ref(useRoute().params.gameId as string);

const board = ref<Board>({
  pieces: [],
});

const whitePlayerName = ref("");
const blackPlayerName = ref("");

const playerColor = ref(PieceColor.White);

const reverseBoard = computed(() => {
  return get(playerColor) === PieceColor.Black;
});

const moveHistory = ref<MoveItem[]>([]);

const gameHasStarted = ref(false);

const activeColor = ref<PieceColor>(PieceColor.White);

const playerCanMove = computed(() => {
  return get(activeColor) === get(playerColor) && get(gameHasStarted);
});

const selectedPiece = ref<Piece | null>(null);

const highlightSquares = computed((): BoardHighlightSquare[] => {
  const list: BoardHighlightSquare[] = [];

  if (get(selectedPiece)) {
    list.push({
      cell: { x: get(selectedPiece)!.x, y: get(selectedPiece)!.y } as Cell,
      color: HighlightColor.Green,
      shape: HighlightShape.SquareFill,
    });
  }

  return list;
});

const showModal = ref(ModalType.None);
const promotionSelectedType = ref<PieceType | null>(null);

const initialize = async () => {
  set(gameHasStarted, false);

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
    set(playerColor, e.playerColor as PieceColor);

    if (e.playerColor === PieceColor.White) {
      set(whitePlayerName, userStore.name);
    } else {
      set(blackPlayerName, userStore.name);
    }

    // set opponent if they already joined before us
    if (e.playerColor === PieceColor.White) {
      set(blackPlayerName, e.opponentName || "Opponent");
    } else {
      set(whitePlayerName, e.opponentName || "Opponent");
    }

    // set move history
    set(moveHistory, e.moves);

    // set active color
    set(activeColor, e.activeColor as PieceColor);
  });

  hubConnection.onGameStarted((e: GameStartedResponse) => {
    // the game started event means the opponent joined

    // set names
    set(whitePlayerName, e.whitePlayerName);
    set(blackPlayerName, e.blackPlayerName);

    set(gameHasStarted, true);
  });

  hubConnection.onMove(async (e: MoveItem) => {
    resolveMove(e);
  });

  // join the game
  await hubConnection.joinGame(get(gameId), userStore.token, userStore.name);
};

const getPieceAtCell = (x: number, y: number): Piece | undefined => {
  return get(board).pieces.find((piece) => piece.x === x && piece.y === y);
};

const resolveMove = (move: MoveItem) => {
  console.log("resolving move", move);

  // get the piece at the form cell
  let pieceToMove = getPieceAtCell(move.from.x, move.from.y);

  // get the piece at the to cell
  let pieceToCapture = getPieceAtCell(move.to.x, move.to.y);

  if (move.kind === MoveType.EnPassant) {
    pieceToCapture = getPieceAtCell(move.to.x, move.from.y);
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

  // if there is a piece to capture, remove it from the board
  if (pieceToCapture) {
    get(board).pieces = get(board).pieces.filter((p) => p !== pieceToCapture);
  }

  // move the piece to its new position
  pieceToMove.x = move.to.x;
  pieceToMove.y = move.to.y;

  // if it's a castling move, move the rook
  if (move.kind === MoveType.Castling) {
    if (move.to.x === 2) {
      let rook = getPieceAtCell(0, move.to.y);
      if (rook) {
        rook.x = 3;
      }
    } else if (move.to.x === 6) {
      let rook = getPieceAtCell(7, move.to.y);
      if (rook) {
        rook.x = 5;
      }
    }
  }

  // if it's a promotion move, change the piece type
  if (move.kind === MoveType.Promotion) {
    pieceToMove.type = move.promoteToType as PieceType;
  }

  // push the move to the move history
  get(moveHistory).push(move);

  // change the active color
  set(activeColor, invertColor(move.color));
};

const askForPromotion = (): Promise<PieceType> => {
  // open the promotion modal
  set(showModal, ModalType.Promotion);

  // return a promise that will be resolved when the user selects a promotion
  return new Promise((resolve) => {
    watch(promotionSelectedType, (type) => {
      if (type) {
        resolve(type);
      }
    });
  });
};

const onPromotionSelected = async (e: PromotionSelectedEvent) => {
  const { type } = e;

  // set the promotion type
  set(promotionSelectedType, type);

  // hide the modal
  set(showModal, ModalType.None);
};

const onPieceSelected = (e: PieceSelectedEvent) => {
  const piece = e.piece;

  if (piece.color !== get(playerColor)) {
    return;
  }

  console.log("piece selected", piece);

  set(selectedPiece, piece);
};

const onPieceDeselected = () => {
  console.log("piece deselected");
  set(selectedPiece, null);
};

const onPieceMoved = async (e: PieceMovedEvent) => {
  if (!get(playerCanMove)) {
    return;
  }

  const { piece, to } = e;

  console.log(`piece moved to ${getSquareName(to.x, to.y)}`, piece);

  if (piece?.color !== get(playerColor)) {
    return;
  }

  const move = {
    from: { x: piece.x, y: piece.y },
    to: { x: to.x, y: to.y },
  } as Move;

  // TODO: validate move

  let promoteToType: null | PieceType = null;

  // if the move is a promotion, ask the user for the promotion type
  if (piece.type === PieceType.Pawn && (to.y === 0 || to.y === 7)) {
    promoteToType = await askForPromotion();
  }

  await hubConnection.makeMove(get(gameId), move, promoteToType);

  set(selectedPiece, null);
};

onMounted(async () => {
  await initialize();
});
</script>
