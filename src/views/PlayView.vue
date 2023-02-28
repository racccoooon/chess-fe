<template>
  <GameLayout
    :pieces="pieces"
    :move-history="moveHistory"
    :reverse-board="reverseBoard"
    :active-color="activeColor"
    :is-player="true"
    :player-color="playerColor"
    :game-has-started="gameHasStarted"
    :white-player-name="whitePlayerName"
    :black-player-name="blackPlayerName"
    :highlight-squares="highlightSquares"
    :panel-tabs="[GameInfoTab.Game, GameInfoTab.Share, GameInfoTab.Settings]"
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
        <div
          class="flex flex-col gap-4"
          v-if="showModal === ModalType.IllegalMove"
        >
          <h2 class="font-bold text-lg">Whoops! An illegal move?!</h2>
          <p>Don't do that</p>
          <button
            @click="showModal = ModalType.None"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-xl"
          >
            ok
          </button>
        </div>
      </SuperDuperModal>
    </template>
  </GameLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import type {
  BoardHighlightSquare,
  GameStartedResponse,
  JoinGameResponse,
  Move,
  MoveItem,
  Piece,
  PieceMovedEvent,
  PieceSelectedEvent,
  PromotionSelectedEvent,
  Square,
} from "@/lib/types";
import {
  GameInfoTab,
  HighlightShape,
  ModalType,
  PieceColor,
  PieceType,
  PlayerColor,
} from "@/lib/types";
import { computed, onMounted, ref, watch } from "vue";
import { get, set, syncRef, useMemoize, whenever } from "@vueuse/core";
import { SignalrConnection } from "@/lib/signalr";
import { useUserStore } from "@/stores/user";
import { getSquareName } from "@/lib/chessNotation";
import {
  applyMove,
  comparePieceAndPlayerColor,
  getPieceAtSquare,
  getPieceSquare,
  getValidSquaresForPiece,
  invertColor,
} from "@/lib/chess";
import GameLayout from "@/components/GameLayout.vue";
import SuperDuperModal from "@/components/modals/SuperDuperModal.vue";
import PromoteModalContent from "@/components/modals/PromoteModalContent.vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { getValidMoves } from "@/lib/api";

const router = useRouter();
const hubConnection = new SignalrConnection();

const userStore = useUserStore();
const settingsStore = useSettingsStore();

const { showLegalMoves, legalMoveHighlightColor } = storeToRefs(settingsStore);

const { name: userName, token: userToken } = storeToRefs(userStore);

const gameId = ref(useRoute().params.gameId as string);

const pieces = ref<Piece[]>([]);

const whitePlayerName = ref("");
const blackPlayerName = ref("");

const playerColor = ref(PlayerColor.White);

const reverseBoard = computed(() => {
  return get(playerColor) === PlayerColor.Black;
});

const moveHistory = ref<MoveItem[]>([]);

const gameHasStarted = ref(false);

const activeColor = ref<PieceColor>(PieceColor.White);

const playerCanMove = computed(() => {
  return (
    comparePieceAndPlayerColor(get(activeColor), get(playerColor)) &&
    get(gameHasStarted)
  );
});

const selectedPiece = ref<Piece | null>(null);

const validMoves = ref<{ from: Square; to: Square[] }[]>([]);

/***
 * Query the server for valid moves for a piece and cache the result
 */
const getValidMovesFromServer = useMemoize(async (piece: Piece) => {
  return await getValidMoves(
    get(gameId),
    get(userToken),
    getPieceSquare(piece)
  );
});

/**
 * When the selected piece changes, query the server for valid moves
 */
whenever(selectedPiece, async () => {
  if (!get(selectedPiece)) {
    return;
  }

  const validSquares = await getValidMovesFromServer(get(selectedPiece)!);

  const square = getPieceSquare(get(selectedPiece)!);

  const moves = get(validMoves).find(
    (e) => e.from.x == square.x && e.from.y == square.y
  );

  if (moves) {
    moves.to = validSquares;
  } else {
    get(validMoves).push({
      from: getPieceSquare(get(selectedPiece)!),
      to: validSquares,
    });
  }
});

/***
 * When the pieces change, clear the valid moves cache
 */
watch(pieces, () => {
  getValidMovesFromServer.clear();
});

const validSquaresForSelectedPiece = computed(() => {
  if (!get(selectedPiece)) {
    return [];
  }

  const square = getPieceSquare(get(selectedPiece)!);

  const moves = get(validMoves).find(
    (e) => e.from.x == square.x && e.from.y == square.y
  );

  if (moves) {
    return moves.to;
  }

  return getValidSquaresForPiece(
    get(pieces),
    get(selectedPiece)!,
    get(moveHistory)
  );
});

const highlightSquares = computed((): BoardHighlightSquare[] => {
  const list: BoardHighlightSquare[] = [];

  if (get(showLegalMoves)) {
    get(validSquaresForSelectedPiece).forEach((square) => {
      const isCapture =
        getPieceAtSquare(get(pieces), square.x, square.y) !== undefined;
      list.push({
        square: square,
        color: get(legalMoveHighlightColor),
        shape: isCapture ? HighlightShape.CircleOutline : HighlightShape.Dot,
      });
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
    set(showModal, ModalType.IllegalMove);
  });

  hubConnection.onGameJoined((e: JoinGameResponse) => {
    // the game joined event means we successfully joined the game as a player
    // we need to set up the board and player color
    // the opponent may or may not have joined yet

    // setup board
    e.board.forEach((piece) => {
      get(pieces).push({
        type: piece.type as PieceType,
        color: piece.color as PieceColor,
        x: piece.position.x,
        y: piece.position.y,
      });
    });

    // set player color
    set(playerColor, e.playerColor as PlayerColor);

    if (e.playerColor === PlayerColor.White) {
      syncRef(userName, whitePlayerName);
    } else {
      syncRef(userName, blackPlayerName);
    }

    // set opponent if they already joined before us
    if (e.playerColor === PlayerColor.White) {
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
  await hubConnection.joinGame(get(gameId), get(userToken), get(userName));
};

const resolveMove = (move: MoveItem) => {
  console.log("resolving move", move);

  // update the board
  set(pieces, applyMove(get(pieces), move));

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

  if (!comparePieceAndPlayerColor(piece.color, get(playerColor))) {
    return;
  }

  set(selectedPiece, piece);
};

const onPieceDeselected = () => {
  set(selectedPiece, null);
};

const onPieceMoved = async (e: PieceMovedEvent) => {
  if (!get(playerCanMove)) {
    return;
  }

  const { piece, to } = e;

  console.log(`piece moved to ${getSquareName(to.x, to.y)}`, piece);

  if (!comparePieceAndPlayerColor(piece?.color, get(playerColor))) {
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
