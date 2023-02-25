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
    v-model:white-player-name="whitePlayerName"
    v-model:black-player-name="blackPlayerName"
    :highlight-squares="highlightSquares"
    :panel-tabs="[
      GameInfoTab.Analysis,
      GameInfoTab.GameSetup,
      GameInfoTab.Settings,
    ]"
    @piece-selected="onPieceSelected"
    @piece-deselected="onPieceDeselected"
    @piece-moved="onPieceMoved"
    @import-game="onImportGame"
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
  ImportGameEvent,
} from "@/lib/types";
import {
  applyMove,
  fenToPieces,
  getInitialBoard,
  getPieceAtSquare,
  getPieceSquare,
  getValidSquaresForPiece,
} from "@/lib/chess";
import { get, set } from "@vueuse/core";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { notationToMoves } from "@/lib/chessNotation";
import SuperDuperModal from "@/components/modals/SuperDuperModal.vue";

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

const whitePlayerName = ref("White");
const blackPlayerName = ref("Black");

const importError = ref(false);
const importErrorMessage = ref("");

const onImportGame = (e: ImportGameEvent) => {
  const { san, fen } = e;

  try {
    const res = notationToMoves(san, fenToPieces(fen), (rPieces, rMoves) => {
      set(pieces, rPieces);
      set(moveHistory, rMoves);
    });

    set(pieces, res.pieces);
    set(moveHistory, res.moves);
  } catch (e: any) {
    set(importError, true);
    set(importErrorMessage, e.message as string);
  }

  // i dont like try catch blocks either
};

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
