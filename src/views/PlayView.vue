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
    :setup-fen="setupFen"
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
        <LoadingModalContent v-if="showModal === ModalType.Loading" />
        <SetNameModalContent
          v-if="showModal === ModalType.SetName"
          @dismissed="showModal = ModalType.None"
        />
        <GameOverModalContent
          v-if="showModal === ModalType.GameOver"
          :is-player="true"
          :player-color="playerColor"
          :game-result="gameResult"
          :white-player-name="whitePlayerName"
          :black-player-name="blackPlayerName"
          :setup-fen="setupFen"
          :move-history="moveHistory"
          @dismissed="showModal = ModalType.None"
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
  PlayerNameChangedResponse,
  PromotionSelectedEvent,
  Square,
} from "@/lib/types";
import {
  GameInfoTab,
  GameResult,
  HighlightShape,
  KingStatus,
  ModalType,
  PieceColor,
  PieceType,
  PlayerColor,
} from "@/lib/types";
import { computed, onMounted, ref, watch } from "vue";
import {
  get,
  set,
  syncRef,
  useMemoize,
  watchDebounced,
  whenever,
} from "@vueuse/core";
import { SignalrConnection } from "@/lib/signalr";
import { useUserStore } from "@/stores/user";
import { getSquareName } from "@/lib/chessNotation";
import {
  applyMove,
  comparePieceAndPlayerColor,
  defaultFen,
  getPieceAtSquare,
  getPieceSquare,
  getValidSquaresForPiece,
  invertColor,
  piecesToFen,
} from "@/lib/chess";
import GameLayout from "@/components/GameLayout.vue";
import SuperDuperModal from "@/components/modals/SuperDuperModal.vue";
import PromoteModalContent from "@/components/modals/PromoteModalContent.vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { getValidMoves } from "@/lib/api";
import LoadingModalContent from "@/components/modals/LoadingModalContent.vue";
import SetNameModalContent from "@/components/modals/SetNameModalContent.vue";
import GameOverModalContent from "@/components/modals/GameOverModalContent.vue";

const router = useRouter();
const hubConnection = new SignalrConnection();

const { showLegalMoves, legalMoveHighlightColor } = storeToRefs(
  useSettingsStore()
);

const {
  name: userName,
  token: userToken,
  hasSetName: hasSetUserName,
} = storeToRefs(useUserStore());

const gameId = ref(useRoute().params.gameId as string);

const pieces = ref<Piece[]>([]);

const setupFen = ref(defaultFen);

const whitePlayerName = ref("");
const blackPlayerName = ref("");

const playerColor = ref(PlayerColor.White);

const reverseBoard = computed(() => {
  return get(playerColor) === PlayerColor.Black;
});

const moveHistory = ref<MoveItem[]>([]);

const gameHasStarted = ref(false);

const activeColor = ref<PieceColor>(PieceColor.White);

const gameResult = ref<GameResult>(GameResult.InProgress);

watchDebounced(
  userName,
  () => {
    hubConnection.changeName(get(userToken), get(userName));
  },
  { debounce: 500, maxWait: 1000 }
);

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

const showModal = ref(ModalType.Loading);
const promotionSelectedType = ref<PieceType | null>(null);

const lastMove = computed(() => {
  if (get(moveHistory).length === 0) {
    return null;
  }

  return get(moveHistory)[get(moveHistory).length - 1];
});

const initialize = async () => {
  set(gameHasStarted, false);

  // initialize the signalr connection and register the event handlers
  await hubConnection.start();

  hubConnection.onGameFull(() => {
    router.push({ name: "spectate", params: { gameId: get(gameId) } });
  });

  hubConnection.onGameNotFound(() => {
    alert("Game not found!");
    router.push({ name: "home" });
  });

  hubConnection.onPlayerNotFound(() => {
    alert("Player not found!");
    router.push({ name: "home" });
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

    // set setup fen
    const initialPieces = e.initialBoard.map((piece) => {
      return {
        type: piece.type as PieceType,
        color: piece.color as PieceColor,
        x: piece.position.x,
        y: piece.position.y,
      };
    });
    set(setupFen, piecesToFen(initialPieces));

    // set player color
    set(playerColor, e.playerColor as PlayerColor);

    if (e.playerColor === PlayerColor.White) {
      syncRef(userName, whitePlayerName);
    } else {
      syncRef(userName, blackPlayerName);
    }

    // set opponent if they already joined before us
    if (get(playerColor) !== PlayerColor.White)
      set(whitePlayerName, e.whitePlayerName || "Opponent");
    if (get(playerColor) !== PlayerColor.Black)
      set(blackPlayerName, e.blackPlayerName || "Opponent");

    // set move history
    set(moveHistory, e.moves);

    // set active color
    set(activeColor, e.activeColor as PieceColor);

    // disable loading modal
    set(showModal, ModalType.None);

    // check if the game has ended
    if (get(lastMove)) {
      checkIfGameHasEnded(get(lastMove)!);
    }
  });

  hubConnection.onGameStarted((e: GameStartedResponse) => {
    // the game started event means the opponent joined

    // set names
    if (get(playerColor) !== PlayerColor.White)
      set(whitePlayerName, e.whitePlayerName);
    if (get(playerColor) !== PlayerColor.Black)
      set(blackPlayerName, e.blackPlayerName);

    set(gameHasStarted, true);
  });

  hubConnection.onMove(async (e: MoveItem) => {
    resolveMove(e);
    checkIfGameHasEnded(e);
  });

  hubConnection.onPlayerNameChanged((e: PlayerNameChangedResponse) => {
    if (comparePieceAndPlayerColor(e.color, get(playerColor))) {
      return;
    }

    if (e.color === PieceColor.White) {
      set(whitePlayerName, e.name);
    } else {
      set(blackPlayerName, e.name);
    }
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

const checkIfGameHasEnded = (move: MoveItem) => {
  // check if game has ended
  if (move.status === KingStatus.IsCheckmate) {
    set(
      gameResult,
      move.color === PieceColor.White
        ? GameResult.WhiteWins
        : GameResult.BlackWins
    );

    set(showModal, ModalType.GameOver);
  }
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

  if (!get(hasSetUserName)) {
    set(showModal, ModalType.SetName);
  }
});
</script>
import { isDefined } from '@vueuse/core';
