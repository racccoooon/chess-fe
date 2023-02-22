import { defineStore } from "pinia";
import { NotationType } from "@/lib/chessNotation";
import { toRefs, useStorage } from "@vueuse/core";
import {
  AnimationDuration,
  ChessBoardBorder,
  ChessBoardColor,
  ClickDuration,
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
        boardColor: ChessBoardColor.Green,
        boardBorder: ChessBoardBorder.None,
        pieceSet: PieceSet.Modern,
        piecesDisplaySize: PiecesDisplaySize.Medium,
        animationDuration: AnimationDuration.Medium as
          | AnimationDuration
          | number,
        showCoordinates: true,
      },
      localStorage,
      { mergeDefaults: true }
    )
  );
});
