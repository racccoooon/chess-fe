<template>
  <GameLayout
    :pieces="pieces"
    :move-history="moveHistory"
    :reverse-board="false"
    :active-color="activeColor"
    :player-color="PlayerColor.Both"
    :is-player="true"
    :can-move="true"
    :game-has-started="true"
    :white-player-name="'White'"
    :black-player-name="'Black'"
    :highlight-squares="highlightSquares"
    :panel-tabs="[GameInfoTab.Analysis, GameInfoTab.Settings]"
    @piece-selected="onPieceSelected"
    @piece-deselected="onPieceDeselected"
    @piece-moved="onPieceMoved"
  />
</template>

<script setup lang="ts">
import GameLayout from "@/components/GameLayout.vue";
import { computed, ref } from "vue";
import {
  HighlightShape,
  GameInfoTab,
  KingStatus,
  MoveType,
  PieceColor,
  PlayerColor,
} from "@/lib/types";
import type {
  BoardHighlightSquare,
  Piece,
  MoveItem,
  PieceMovedEvent,
  PieceSelectedEvent,
} from "@/lib/types";
import {
  applyMove,
  getInitialBoard,
  getPieceAtSquare,
  getPieceSquare,
  getValidSquaresForPiece,
} from "@/lib/chess";
import { get, set } from "@vueuse/core";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";

const settingsStore = useSettingsStore();

const { showLegalMoves, legalMoveHighlightColor } = storeToRefs(settingsStore);

const pieces = ref<Piece[]>(getInitialBoard());

const moveHistory = ref<MoveItem[]>([]);

const selectedPiece = ref<Piece | null>(null);

const activeColor = computed(() => {
  return moveHistory.value.length % 2 === 0
    ? PieceColor.White
    : PieceColor.Black;
});

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

  get(moveHistory).push(move);
};
</script>
