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
      <div class="w-full xl:h-3/4">
        <BoardRenderer
          :board="board"
          :reverse="reverseBoard"
          :isWhiteInCheck="isWhiteInCheck"
          :isBlackInCheck="isBlackInCheck"
          :highlight-squares="highlightSquares"
          :allow-drag="canMove"
          :allow-interaction-with-white="
            canMove && playerColor === PieceColor.White
          "
          :allow-interaction-with-black="
            canMove && playerColor === PieceColor.Black
          "
          @piece-selected="onPieceSelected"
          @piece-deselected="onPieceDeselected"
          @piece-moved="onPieceMoved"
          class="h-full sm:rounded-2xl"
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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import PlayerInfo from "@/components/PlayerInfo.vue";
import type {
  Board,
  BoardHighlightSquare,
  MoveItem,
  PieceMovedEvent,
  PieceSelectedEvent,
} from "@/lib/types";
import { HighlightColor, PieceColor, PieceType } from "@/lib/types";
import { computed } from "vue";
import { get } from "@vueuse/core";
import {
  getCapturedPieces,
  getMaterialValueByColor,
  getPiecesByType,
  isInCheck,
} from "@/lib/chess";
import GameInfoPanel from "@/components/GameInfoPanel.vue";

const props = defineProps<{
  board: Board;
  moveHistory: MoveItem[];
  reverseBoard: boolean;
  activeColor: PieceColor;
  isPlayer: boolean;
  canMove: boolean;
  playerColor: PieceColor;
  gameHasStarted: boolean;
  whitePlayerName: string;
  blackPlayerName: string;
  highlightSquares: BoardHighlightSquare[];
}>();

const emit = defineEmits<{
  (event: "pieceSelected", payload: PieceSelectedEvent): void;
  (event: "pieceDeselected"): void;
  (event: "pieceMoved", payload: PieceMovedEvent): void;
}>();

const lastMove = computed(() => {
  return props.moveHistory[props.moveHistory.length - 1] || null;
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
  return getMaterialValueByColor(props.board.pieces, PieceColor.White);
});

const blackMaterialValue = computed(() => {
  return getMaterialValueByColor(props.board.pieces, PieceColor.Black);
});

const whiteMaterialAdvantage = computed(() => {
  return get(whiteMaterialValue) - get(blackMaterialValue);
});

const blackMaterialAdvantage = computed(() => {
  return get(blackMaterialValue) - get(whiteMaterialValue);
});

const whiteCaputredPieces = computed(() => {
  return getCapturedPieces(props.board.pieces, PieceColor.White);
});

const blackCaputredPieces = computed(() => {
  return getCapturedPieces(props.board.pieces, PieceColor.Black);
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
    return get(whiteCaputredPieces);
  } else {
    return get(blackCaputredPieces);
  }
});

const bottomPlayerCapturedPieces = computed(() => {
  if (props.reverseBoard) {
    return get(blackCaputredPieces);
  } else {
    return get(whiteCaputredPieces);
  }
});

// compute highlights
const highlightSquares = computed((): BoardHighlightSquare[] => {
  const list: BoardHighlightSquare[] = [];

  if (get(isAnyInCheck)) {
    const king = getPiecesByType(
      props.board.pieces,
      PieceType.King,
      props.activeColor
    )[0];
    list.push({
      cell: { x: king.x, y: king.y },
      color: HighlightColor.Red,
    });
  }

  if (get(lastMove)) {
    list.push({
      cell: get(lastMove).from,
      color: HighlightColor.Yellow,
    });
    list.push({
      cell: get(lastMove).to,
      color: HighlightColor.Yellow,
    });
  }

  list.push(...props.highlightSquares);

  return list;
});

const onPieceSelected = (e: PieceSelectedEvent) => {
  emit("pieceSelected", { piece: e.piece });
};

const onPieceDeselected = () => {
  emit("pieceDeselected");
};

const onPieceMoved = (e: PieceMovedEvent) => {
  emit("pieceMoved", { piece: e.piece, to: e.to });
};
</script>
