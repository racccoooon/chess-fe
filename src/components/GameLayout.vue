<template>
  <div
    class="sm:m-12 xl:my-0 xl:h-screen flex flex-col xl:flex-row gap-6 xl:gap-16 justify-center items-center"
  >
    <div
      class="flex flex-col justify-center xl:basis-5/12 xl:basis-1 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-auto xl:h-screen"
    >
      <PlayerInfo
        :color="topPlayerColor"
        :name="topPlayerName"
        :material-advantage="topPlayerMaterialAdvantage"
        :captured-pieces="topPlayerCapturedPieces"
      />
      <div class="w-full xl:h-3/4 relative sm:rounded-2xl overflow-hidden">
        <div>
          <slot name="board-overlay" />
        </div>
        <BoardRenderer
          :pieces="pieces"
          :reverse="reverseBoard"
          :isWhiteInCheck="isWhiteInCheck"
          :isBlackInCheck="isBlackInCheck"
          :highlight-squares="highlightSquares"
          :allow-interaction-with-white="allowInteractionWithWhite"
          :allow-interaction-with-black="allowInteractionWithBlack"
          @piece-selected="onPieceSelected"
          @piece-deselected="onPieceDeselected"
          @piece-moved="onPieceMoved"
          class="h-full"
        />
      </div>
      <PlayerInfo
        :color="bottomPlayerColor"
        :name="bottomPlayerName"
        :material-advantage="bottomPlayerMaterialAdvantage"
        :captured-pieces="bottomPlayerCapturedPieces"
      />
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
        :tabs="panelTabs"
        @time-travel-relative="historyIndex += $event"
        @time-travel-absolute="historyIndex = $event"
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
} from "@/lib/types";
import {
  GameInfoTab,
  HighlightColor,
  HighlightShape,
  PieceColor,
  PieceType,
  PlayerColor,
} from "@/lib/types";
import { computed, ref, watch } from "vue";
import { get, set, whenever } from "@vueuse/core";
import { useClamp } from "@vueuse/math";
import {
  comparePieceAndPlayerColor,
  getBoardAtHistoryIndex,
  getCapturedPieces,
  getMaterialValueByColor,
  getPiecesByType,
  isInCheck,
} from "@/lib/chess";
import GameInfoPanel from "@/components/GameInfoPanel.vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";

const props = defineProps<{
  pieces: Piece[];
  moveHistory: MoveItem[];
  reverseBoard: boolean;
  activeColor: PieceColor;
  isPlayer: boolean;
  canMove: boolean;
  playerColor: PlayerColor;
  gameHasStarted: boolean;
  whitePlayerName: string;
  blackPlayerName: string;
  highlightSquares: BoardHighlightSquare[];
  panelTabs: GameInfoTab[];
}>();

const emit = defineEmits<{
  (event: "pieceSelected", payload: PieceSelectedEvent): void;
  (event: "pieceDeselected"): void;
  (event: "pieceMoved", payload: PieceMovedEvent): void;
}>();

const historyIndex_ = ref(props.moveHistory.length);

const historyIndex = computed({
  get() {
    return get(historyIndex_);
  },
  set(value: number) {
    set(historyIndex_, get(useClamp(value, 0, props.moveHistory.length)));
  },
});

const settingsStore = useSettingsStore();

const { showLastMove, showCheck, lastMoveHighlightColor } =
  storeToRefs(settingsStore);

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

  return props.moveHistory[get(historyIndex) - 1];
});

const pieces = computed(() => {
  if (!get(isTimeTraveling)) {
    return props.pieces;
  }

  return getBoardAtHistoryIndex(props.moveHistory, get(historyIndex));
});

// computed values for checking if the player is in check
const isWhiteInCheck = computed(() => {
  if (!get(lastMove)) return false;
  return isInCheck(get(lastMove), PieceColor.White);
});

const isBlackInCheck = computed(() => {
  if (!get(lastMove)) return false;
  return isInCheck(get(lastMove), PieceColor.Black);
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
  if (props.reverseBoard) {
    return PieceColor.White;
  } else {
    return PieceColor.Black;
  }
});

const bottomPlayerColor = computed(() => {
  if (props.reverseBoard) {
    return PieceColor.Black;
  } else {
    return PieceColor.White;
  }
});

const topPlayerName = computed(() => {
  if (props.reverseBoard) {
    return props.whitePlayerName;
  } else {
    return props.blackPlayerName;
  }
});

const bottomPlayerName = computed(() => {
  if (props.reverseBoard) {
    return props.blackPlayerName;
  } else {
    return props.whitePlayerName;
  }
});

const topPlayerMaterialAdvantage = computed(() => {
  if (props.reverseBoard) {
    return get(whiteMaterialAdvantage);
  } else {
    return get(blackMaterialAdvantage);
  }
});

const bottomPlayerMaterialAdvantage = computed(() => {
  if (props.reverseBoard) {
    return get(blackMaterialAdvantage);
  } else {
    return get(whiteMaterialAdvantage);
  }
});

const topPlayerCapturedPieces = computed(() => {
  if (props.reverseBoard) {
    return get(whiteCapturedPieces);
  } else {
    return get(blackCapturedPieces);
  }
});

const bottomPlayerCapturedPieces = computed(() => {
  if (props.reverseBoard) {
    return get(blackCapturedPieces);
  } else {
    return get(whiteCapturedPieces);
  }
});

// compute allow interaction

const allowInteractionWithWhite = computed(() => {
  return (
    props.canMove &&
    props.activeColor === PieceColor.White &&
    comparePieceAndPlayerColor(PieceColor.White, props.playerColor) &&
    !get(isTimeTraveling)
  );
});

const allowInteractionWithBlack = computed(() => {
  return (
    props.canMove &&
    props.activeColor === PieceColor.Black &&
    comparePieceAndPlayerColor(PieceColor.Black, props.playerColor) &&
    !get(isTimeTraveling)
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
      square: get(lastMove).from,
      color: get(lastMoveHighlightColor),
      shape: HighlightShape.SquareFill,
    });
    list.push({
      square: get(lastMove).to,
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
  if (get(isTimeTraveling)) return;
  emit("pieceMoved", { piece: e.piece, to: e.to });
};
</script>
