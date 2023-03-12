import { defineStore } from "pinia";
import { NotationType } from "@/lib/chessNotation";
import { toRefs, useStorage } from "@vueuse/core";
import {
  AnimationDuration,
  ChessBoardBorder,
  ChessBoardColor,
  ChessBoardOrientation,
  ClickDuration,
  HighlightColor,
  MoveStyle,
  PiecesDisplaySize,
  PieceSet,
} from "@/lib/types";

export const useSettingsStore = defineStore("settings", () => {
  return toRefs(
    useStorage(
      "settings",
      {
        preferredMoveStyle: MoveStyle.Both,
        clickDuration: ClickDuration.Medium as ClickDuration | number,
        notationType: NotationType.Algebraic,
        useUnicodeIconsInNotation: true,
        showLegalMoves: true,
        showLastMove: true,
        showCheck: true,
        boardColor: ChessBoardColor.Green,
        boardBorder: ChessBoardBorder.None,
        boardOrientation: ChessBoardOrientation.PlayerBottom,
        pieceSet: PieceSet.Modern,
        piecesDisplaySize: PiecesDisplaySize.Medium,
        animationDuration: AnimationDuration.Medium as
          | AnimationDuration
          | number,
        showCoordinates: true,
        lastMoveHighlightColor: HighlightColor.Yellow,
        selectedSquareHighlightColor: HighlightColor.Green,
        legalMoveHighlightColor: HighlightColor.Highlight,
        userHighlightColor: HighlightColor.Red,
        userArrowColor: HighlightColor.Green,
      },
      localStorage,
      { mergeDefaults: true }
    )
  );
});
