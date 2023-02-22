import { defineStore } from "pinia";
import { NotationType } from "@/lib/chessNotation";
import { toRefs, useStorage } from "@vueuse/core";
import {
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
        boardColor: ChessBoardColor.Green,
        boardBorder: ChessBoardBorder.None,
        pieceSet: PieceSet.Modern,
        piecesDisplaySize: PiecesDisplaySize.Medium,
        showCoordinates: true,
      },
      localStorage,
      { mergeDefaults: true }
    )
  );
});
