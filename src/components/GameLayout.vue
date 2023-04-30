<template>
  <FloatingHomeNavButton />
  <div
    class="sm:m-12 xl:my-0 xl:h-screen flex flex-col xl:flex-row gap-6 xl:gap-16 justify-center items-center"
  >
    <div
      class="flex flex-col justify-center xl:basis-5/12 xl:basis-1 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-auto xl:h-screen"
    >
      <div>
        <PlayerInfo
          :color="topPlayerColor"
          :name="topPlayerName"
          :material-advantage="topPlayerMaterialAdvantage"
          :captured-pieces="topPlayerCapturedPieces"
        />
      </div>
      <div
        :data-roundness="boardRoundness"
        class="w-full xl:h-3/4 relative data-[roundness=small]:sm:rounded-md data-[roundness=normal]:sm:rounded-2xl overflow-hidden"
      >
        <div>
          <slot name="board-overlay" />
        </div>
        <BoardRenderer
          ref="boardRenderer"
          :pieces="pieces"
          :reverse="reverseBoard"
          :isWhiteInCheck="isWhiteInCheck"
          :isBlackInCheck="isBlackInCheck"
          :highlight-squares="highlightSquares"
          :allow-interaction-with-white="allowInteractionWithWhite"
          :allow-interaction-with-black="allowInteractionWithBlack"
          :pointer-mode="pointerMode"
          :paint-piece-color="paintPieceColor"
          :paint-piece-type="paintPieceType"
          @piece-selected="onPieceSelected"
          @piece-deselected="onPieceDeselected"
          @piece-moved="onPieceMoved"
          @piece-painted="emit('piecePainted', $event)"
          @piece-erased="emit('pieceErased', $event)"
          class="h-full"
        />
      </div>
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <PlayerInfo
          :color="bottomPlayerColor"
          :name="bottomPlayerName"
          :material-advantage="bottomPlayerMaterialAdvantage"
          :captured-pieces="bottomPlayerCapturedPieces"
        />
        <div class="self-end sm:self-center">
          <button @click="rotate" aria-label="flip board">
            <SvgIcon type="mdi" :path="mdiFlipVertical" class="w-12" />
          </button>
        </div>
      </div>
    </div>
    <div
      class="h-full flex flex-col basis-2/6 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-auto"
    >
      <GameInfoPanel
        :is-player="isPlayer"
        :game-has-started="gameHasStarted"
        :move-history="moveHistory"
        :active-color="activeColor"
        :history-index="historyIndex"
        :white-player-name="whitePlayerName"
        @update:white-player-name="emit('update:whitePlayerName', $event)"
        :black-player-name="blackPlayerName"
        @update:black-player-name="emit('update:blackPlayerName', $event)"
        :setup-fen="setupFen || defaultFen"
        :tabs="panelTabs"
        @time-travel-relative="historyIndex += $event"
        @time-travel-absolute="historyIndex = $event"
        @continue-from-history-index="emit('continueFromHistoryIndex', $event)"
        @import-game="emit('importGame', $event)"
        v-model:pointer-mode="pointerMode"
        v-model:paint-piece-color="paintPieceColor"
        v-model:paint-piece-type="paintPieceType"
        :game-result="gameResult"
        @update:game-result="emit('update:gameResult', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import PlayerInfo from "@/components/PlayerInfo.vue";
import type {
  BoardHighlightSquare,
  MoveItem,
  Piece,
  PieceMovedEvent,
  PieceSelectedEvent,
  PieceErasedEvent,
  PiecePaintedEvent,
  ImportGameEvent,
} from "@/lib/types";
import {
  BoardPointerMode,
  GameResult,
  GameInfoTab,
  HighlightColor,
  HighlightShape,
  PieceColor,
  PieceType,
  PlayerColor,
  MoveType,
  KingStatus,
  ChessBoardOrientation,
} from "@/lib/types";
import { computed, ref, watch } from "vue";
import { get, set, whenever } from "@vueuse/core";
import { useClamp } from "@vueuse/math";
import {
  applyMove,
  comparePieceAndPlayerColor,
  defaultFen,
  fenToPieces,
  getBoardAtHistoryIndex,
  getCapturedPieces,
  getMaterialValueByColor,
  getPiecesByType,
  getPieceSquare,
  isInCheck,
} from "@/lib/chess";
import GameInfoPanel from "@/components/GameInfoPanel.vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import FloatingHomeNavButton from "@/components/FloatingHomeNavButton.vue";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiFlipVertical } from "@mdi/js";

const props = defineProps<{
  pieces: Piece[];
  moveHistory: MoveItem[];
  reverseBoard: boolean;
  activeColor: PieceColor;
  isPlayer: boolean;
  playerColor: PlayerColor;
  gameHasStarted: boolean;
  whitePlayerName: string;
  blackPlayerName: string;
  highlightSquares: BoardHighlightSquare[];
  setupFen?: string;
  gameResult?: GameResult;
  panelTabs: GameInfoTab[];
}>();

const emit = defineEmits<{
  (event: "continueFromHistoryIndex", payload: number): void;
  (event: "pieceSelected", payload: PieceSelectedEvent): void;
  (event: "pieceDeselected"): void;
  (event: "pieceMoved", payload: PieceMovedEvent): void;
  (event: "importGame", payload: ImportGameEvent): void;
  (event: "update:whitePlayerName", payload: string): void;
  (event: "update:blackPlayerName", payload: string): void;
  (event: "piecePainted", payload: PiecePaintedEvent): void;
  (event: "pieceErased", payload: PieceErasedEvent): void;
  (event: "update:gameResult", payload: GameResult): void;
}>();

const boardRenderer = ref();

const historyIndex_ = ref(props.moveHistory.length);

const historyIndex = computed({
  get() {
    return get(historyIndex_);
  },
  set(value: number) {
    set(historyIndex_, get(useClamp(value, 0, props.moveHistory.length)));
  },
});

const {
  showLastMove,
  showCheck,
  lastMoveHighlightColor,
  boardOrientation,
  boardRoundness,
} = storeToRefs(useSettingsStore());

const rotate = () => {
  switch (get(boardOrientation)) {
    case ChessBoardOrientation.WhiteBottom:
      set(boardOrientation, ChessBoardOrientation.BlackBottom);
      break;
    case ChessBoardOrientation.BlackBottom:
      set(boardOrientation, ChessBoardOrientation.WhiteBottom);
      break;
    case ChessBoardOrientation.PlayerBottom:
      set(boardOrientation, ChessBoardOrientation.OpponentBottom);
      break;
    case ChessBoardOrientation.OpponentBottom:
      set(boardOrientation, ChessBoardOrientation.PlayerBottom);
      break;
  }
};

watch(
  () => props.moveHistory.length,
  (newValue) => {
    set(historyIndex, newValue);
  }
);

const isTimeTraveling = computed({
  get() {
    return get(historyIndex) !== props.moveHistory.length;
  },
  set(value: boolean) {
    if (!value) {
      set(historyIndex, props.moveHistory.length);
    }
  },
});

whenever(isTimeTraveling, () => {
  emit("pieceDeselected");
  // TODO: we are only deselecting on the parent component but not on the board
});

const lastMove = computed(() => {
  if (!get(isTimeTraveling)) {
    return props.moveHistory[props.moveHistory.length - 1] || null;
  }

  if (get(alternativePieces).length !== 0) {
    return null;
  }

  return props.moveHistory[get(historyIndex) - 1];
});

const alternativePieces = ref<Piece[]>([]);

const pieces = computed(() => {
  if (!get(isTimeTraveling)) {
    return props.pieces;
  }

  if (get(alternativePieces).length !== 0) {
    return get(alternativePieces);
  }

  return getBoardAtHistoryIndex(
    props.moveHistory,
    get(historyIndex),
    fenToPieces(props.setupFen || defaultFen)
  );
});

watch(historyIndex, () => {
  set(alternativePieces, []);
});

const pointerMode = ref<BoardPointerMode>(BoardPointerMode.Move);
const paintPieceType = ref<PieceType>(PieceType.Pawn);
const paintPieceColor = ref<PieceColor>(PieceColor.White);

const reverseBoard = computed(() => {
  if (get(boardOrientation) === ChessBoardOrientation.WhiteBottom) {
    return false;
  } else if (get(boardOrientation) === ChessBoardOrientation.BlackBottom) {
    return true;
  } else if (get(boardOrientation) === ChessBoardOrientation.OpponentBottom) {
    return !props.reverseBoard;
  }

  return props.reverseBoard;
});

// computed values for checking if the player is in check
const isWhiteInCheck = computed(() => {
  if (!get(lastMove)) return false;
  return isInCheck(get(lastMove)!, PieceColor.White);
});

const isBlackInCheck = computed(() => {
  if (!get(lastMove)) return false;
  return isInCheck(get(lastMove)!, PieceColor.Black);
});

const isAnyInCheck = computed(() => {
  return get(isWhiteInCheck) || get(isBlackInCheck);
});

// computed values for material advantage
const whiteMaterialValue = computed(() => {
  return getMaterialValueByColor(get(pieces), PieceColor.White);
});

const blackMaterialValue = computed(() => {
  return getMaterialValueByColor(get(pieces), PieceColor.Black);
});

const whiteMaterialAdvantage = computed(() => {
  return get(whiteMaterialValue) - get(blackMaterialValue);
});

const blackMaterialAdvantage = computed(() => {
  return get(blackMaterialValue) - get(whiteMaterialValue);
});

const whiteCapturedPieces = computed(() => {
  return getCapturedPieces(get(pieces), PieceColor.White);
});

const blackCapturedPieces = computed(() => {
  return getCapturedPieces(get(pieces), PieceColor.Black);
});

// computed values to display
const topPlayerColor = computed(() => {
  if (get(reverseBoard)) {
    return PieceColor.White;
  } else {
    return PieceColor.Black;
  }
});

const bottomPlayerColor = computed(() => {
  if (get(reverseBoard)) {
    return PieceColor.Black;
  } else {
    return PieceColor.White;
  }
});

const topPlayerName = computed(() => {
  if (get(reverseBoard)) {
    return props.whitePlayerName;
  } else {
    return props.blackPlayerName;
  }
});

const bottomPlayerName = computed(() => {
  if (get(reverseBoard)) {
    return props.blackPlayerName;
  } else {
    return props.whitePlayerName;
  }
});

const topPlayerMaterialAdvantage = computed(() => {
  if (get(reverseBoard)) {
    return get(whiteMaterialAdvantage);
  } else {
    return get(blackMaterialAdvantage);
  }
});

const bottomPlayerMaterialAdvantage = computed(() => {
  if (get(reverseBoard)) {
    return get(blackMaterialAdvantage);
  } else {
    return get(whiteMaterialAdvantage);
  }
});

const topPlayerCapturedPieces = computed(() => {
  if (get(reverseBoard)) {
    return get(whiteCapturedPieces);
  } else {
    return get(blackCapturedPieces);
  }
});

const bottomPlayerCapturedPieces = computed(() => {
  if (get(reverseBoard)) {
    return get(blackCapturedPieces);
  } else {
    return get(whiteCapturedPieces);
  }
});

// compute allow interaction

const allowInteractionWithWhite = computed(() => {
  return (
    comparePieceAndPlayerColor(PieceColor.White, props.playerColor) ||
    get(isTimeTraveling)
  );
});

const allowInteractionWithBlack = computed(() => {
  return (
    comparePieceAndPlayerColor(PieceColor.Black, props.playerColor) ||
    get(isTimeTraveling)
  );
});

// compute highlights
const highlightSquares = computed((): BoardHighlightSquare[] => {
  const list: BoardHighlightSquare[] = [];

  if (get(isAnyInCheck) && get(showCheck)) {
    const king = getPiecesByType(
      get(pieces),
      PieceType.King,
      get(isWhiteInCheck) ? PieceColor.White : PieceColor.Black
    )[0];
    list.push({
      square: { x: king.x, y: king.y },
      color: HighlightColor.Red,
      shape: HighlightShape.SquareFill,
    });
  }

  if (get(lastMove) && get(showLastMove)) {
    list.push({
      square: get(lastMove)!.from,
      color: get(lastMoveHighlightColor),
      shape: HighlightShape.SquareFill,
    });
    list.push({
      square: get(lastMove)!.to,
      color: get(lastMoveHighlightColor),
      shape: HighlightShape.SquareFill,
    });
  }

  list.push(...props.highlightSquares);

  return list;
});

const onPieceSelected = (e: PieceSelectedEvent) => {
  if (get(isTimeTraveling)) return;
  emit("pieceSelected", { piece: e.piece });
};

const onPieceDeselected = () => {
  if (get(isTimeTraveling)) return;
  emit("pieceDeselected");
};

const onPieceMoved = (e: PieceMovedEvent) => {
  if (get(isTimeTraveling)) {
    if (get(alternativePieces).length === 0) {
      set(alternativePieces, get(pieces));
    }

    const { piece, to } = e;

    if (!piece) {
      return;
    }

    const move = {
      from: getPieceSquare(piece),
      to: to,
      color: piece.color,
      type: piece.type,
      kind: MoveType.NonSpecial,
      status: KingStatus.IsNoCheck,
      captures: false,
      promoteToType: null,
    } as MoveItem;

    applyMove(get(alternativePieces), move);

    return;
  }

  emit("pieceMoved", { piece: e.piece, to: e.to });
};

defineExpose({
  boardRenderer,
});
</script>
