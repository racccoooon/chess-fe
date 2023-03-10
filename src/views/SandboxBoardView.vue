<template>
  <GameLayout
    :pieces="pieces"
    :move-history="moveHistory"
    :reverse-board="false"
    :active-color="activeColor"
    :player-color="PlayerColor.Both"
    :is-player="true"
    :game-has-started="true"
    v-model:white-player-name="whitePlayerName"
    v-model:black-player-name="blackPlayerName"
    :highlight-squares="highlightSquares"
    :panel-tabs="[
      GameInfoTab.Analysis,
      GameInfoTab.Edit,
      GameInfoTab.GameSetup,
      GameInfoTab.Settings,
    ]"
    :setup-fen="setupFen"
    v-model:game-result="gameResult"
    @continue-from-history-index="onContinueFromHistoryIndex"
    @piece-selected="onPieceSelected"
    @piece-deselected="onPieceDeselected"
    @piece-moved="onPieceMoved"
    @import-game="onImportGame"
    @piece-painted="onPiecePainted"
    @piece-erased="onPieceErased"
  >
    <template #board-overlay>
      <SuperDuperModal v-if="importError">
        <div class="flex flex-col gap-4">
          <h2 class="font-bold text-lg">Failed to import</h2>
          <p>{{ importErrorMessage }}</p>
          <button
            @click="importError = false"
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
import GameLayout from "@/components/GameLayout.vue";
import { computed, ref, watch } from "vue";
import type {
  BoardHighlightSquare,
  ImportGameEvent,
  MoveItem,
  Piece,
  PieceErasedEvent,
  PieceMovedEvent,
  PiecePaintedEvent,
  PieceSelectedEvent,
} from "@/lib/types";
import {
  GameInfoTab,
  GameResult,
  HighlightShape,
  KingStatus,
  MoveType,
  PieceColor,
  PieceType,
  PlayerColor,
} from "@/lib/types";
import {
  applyMove,
  defaultFen,
  fenToPieces,
  getBoardAtHistoryIndex,
  getHistoryUntilIndex,
  getMoveItem,
  getPieceAtSquare,
  getPieceSquare,
  getValidSquaresForPiece,
  piecesToFen,
} from "@/lib/chess";
import { get, set, watchDebounced } from "@vueuse/core";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import {
  gameResultNotation,
  getGameNotation,
  notationToMoves,
  NotationType,
  parseGameResultNotation,
} from "@/lib/chessNotation";
import SuperDuperModal from "@/components/modals/SuperDuperModal.vue";
import { useRoute, useRouter } from "vue-router";

const { showLegalMoves, legalMoveHighlightColor } = storeToRefs(
  useSettingsStore()
);

const router = useRouter();
const query = useRoute().query;

const setupFen = ref((query.fen as string) || defaultFen);

const pieces = ref<Piece[]>(fenToPieces(get(setupFen)));
const moveHistory = ref<MoveItem[]>([]);

const gameResult = ref<GameResult>(
  parseGameResultNotation(query.result as string) || GameResult.InProgress
);

const selectedPiece = ref<Piece | null>(null);
const activeColor = computed(() => {
  return moveHistory.value.length % 2 === 0
    ? PieceColor.White
    : PieceColor.Black;
});

const whitePlayerName = ref((query.white as string) || "White");
const blackPlayerName = ref((query.black as string) || "Black");

const importError = ref(false);
const importErrorMessage = ref("");

const lastMove = computed(() => {
  return get(moveHistory)[get(moveHistory).length - 1];
});

watch(lastMove, (newValue) => {
  if (!newValue) return;

  if (newValue.status === KingStatus.IsCheckmate) {
    set(
      gameResult,
      newValue.color === PieceColor.White
        ? GameResult.WhiteWins
        : GameResult.BlackWins
    );
  }

  if (newValue.status === KingStatus.IsStalemate) {
    set(gameResult, GameResult.Draw);
  }
});

const onImportGame = (e: ImportGameEvent) => {
  const { san, fen } = e;

  try {
    const res = notationToMoves(san, fenToPieces(fen), (rPieces, rMoves) => {
      set(pieces, rPieces);
      set(moveHistory, rMoves);
    });

    set(pieces, res.pieces);
    set(moveHistory, res.moves);

    set(setupFen, fen);
  } catch (e: any) {
    set(importError, true);
    set(importErrorMessage, e.message as string);
  }

  // i dont like try catch blocks either
};

if (query.moves) {
  const san = (query.moves as string).split("/").join(" ");

  onImportGame({
    san,
    fen: get(setupFen),
  });
}

const onContinueFromHistoryIndex = (index: number) => {
  const newPieces = getBoardAtHistoryIndex(
    get(moveHistory),
    index,
    fenToPieces(get(setupFen))
  );
  const newMoveHistory = getHistoryUntilIndex(get(moveHistory), index);

  set(pieces, newPieces);
  set(moveHistory, newMoveHistory);
};

const updateQuery = () => {
  let query: any = {};

  if (get(whitePlayerName) !== "White") {
    query.white = get(whitePlayerName);
  }

  if (get(blackPlayerName) !== "Black") {
    query.black = get(blackPlayerName);
  }

  if (get(setupFen) !== defaultFen) {
    query.fen = get(setupFen);
  }

  if (get(gameResult) !== GameResult.InProgress) {
    // don't add result if last move is checkmate by the player that won according to the result
    if (
      !(
        get(lastMove) &&
        get(lastMove)!.status === KingStatus.IsCheckmate &&
        get(lastMove)!.color ===
          (get(gameResult) === GameResult.WhiteWins
            ? PieceColor.White
            : PieceColor.Black)
      ) ||
      get(gameResult) === GameResult.Draw
    ) {
      query.result = gameResultNotation[get(gameResult)];
    }
  }

  if (get(moveHistory).length !== 0) {
    const notation = getGameNotation(
      get(moveHistory),
      NotationType.Algebraic,
      false,
      fenToPieces(get(setupFen))
    );

    query.moves = notation.split(" ").join("/");
  }

  router.replace({ query });
};

watchDebounced(
  [pieces, moveHistory, whitePlayerName, blackPlayerName, gameResult],
  () => {
    updateQuery();
  },
  { deep: true, debounce: 500, maxWait: 1000 }
);

const validSquaresForSelectedPiece = computed(() => {
  if (!get(selectedPiece)) {
    return [];
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

const onPieceSelected = (e: PieceSelectedEvent) => {
  const { piece } = e;

  set(selectedPiece, piece);
};

const onPieceDeselected = () => {
  set(selectedPiece, null);
};

const onPieceMoved = (e: PieceMovedEvent) => {
  const { piece, to } = e;

  if (!piece) return;

  if (piece.color !== get(activeColor)) return;

  const move = getMoveItem(
    {
      from: getPieceSquare(piece),
      to,
    },
    get(pieces),
    get(moveHistory)
  );

  if (!move) return;

  if (move.kind === MoveType.Promotion) {
    move.promoteToType = PieceType.Queen;
  }

  set(pieces, applyMove(get(pieces), move));
  set(selectedPiece, null);

  set(gameResult, GameResult.InProgress);

  get(moveHistory).push(move);
};

const onPiecePainted = (e: PiecePaintedEvent) => {
  const { square, type, color } = e;

  const existingPiece = getPieceAtSquare(get(pieces), square.x, square.y);

  if (existingPiece) {
    existingPiece.type = type;
    existingPiece.color = color;
  } else {
    get(pieces).push({
      type: type,
      color: color,
      x: square.x,
      y: square.y,
    });
  }

  set(moveHistory, []);
  set(setupFen, piecesToFen(get(pieces)));
};

const onPieceErased = (e: PieceErasedEvent) => {
  const { square } = e;

  const existingPiece = getPieceAtSquare(get(pieces), square.x, square.y);

  if (existingPiece) {
    get(pieces).splice(get(pieces).indexOf(existingPiece), 1);
  }

  set(moveHistory, []);
  set(setupFen, piecesToFen(get(pieces)));
};
</script>
