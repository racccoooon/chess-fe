<template>
  <BoardRenderer
    :pieces="pieces"
    :reverse="false"
    :highlight-squares="highlightSquares"
    :is-white-in-check="false"
    :is-black-in-check="false"
    :allow-interaction-with-white="true"
    :allow-interaction-with-black="true"
    @piece-selected="onPieceSelected"
    @piece-deselected="onPieceDeselected"
    @piece-moved="onPieceMoved"
    :pointer-mode="BoardPointerMode.Move"
    :paint-piece-color="PieceColor.White"
    :paint-piece-type="PieceType.Pawn"
  />
</template>

<script setup lang="ts">
import BoardRenderer from "@/components/BoardRenderer.vue";
import {
  BoardPointerMode,
  HighlightShape,
  KingStatus,
  MoveType,
  PieceColor,
  PieceType,
} from "@/lib/types";
import type {
  BoardHighlightSquare,
  MoveItem,
  Piece,
  PieceMovedEvent,
  PieceSelectedEvent,
} from "@/lib/types";
import { get, set } from "@vueuse/core";
import { computed, ref } from "vue";
import {
  applyMove,
  getInitialBoard,
  getPieceAtSquare,
  getPieceSquare,
  getValidSquaresForPiece,
} from "@/lib/chess";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";

const settingsStore = useSettingsStore();

const { showLegalMoves, legalMoveHighlightColor } = storeToRefs(settingsStore);

const pieces = ref<Piece[]>(getInitialBoard());

const selectedPiece = ref<Piece | null>(null);

const validSquaresForSelectedPiece = computed(() => {
  if (!get(selectedPiece)) {
    return [];
  }

  return getValidSquaresForPiece(get(pieces), get(selectedPiece)!, []);
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

  set(pieces, applyMove(get(pieces), move));
  set(selectedPiece, null);
};
</script>
