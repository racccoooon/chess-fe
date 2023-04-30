import { defineStore } from "pinia";
import { NotationType } from "@/lib/chessNotation";
import { set, toRefs, useStorage } from "@vueuse/core";
import {
  AnimationDuration,
  ChessBoardBorder,
  ChessBoardColor,
  ChessBoardOrientation,
  ChessBoardRoundness,
  ClickDuration,
  HighlightColor,
  MoveStyle,
  PiecesDisplaySize,
  PieceSet,
} from "@/lib/types";

export const useSettingsStore = defineStore("settings", () => {
  const defaults = {
    preferredMoveStyle: MoveStyle.Both,
    clickDuration: ClickDuration.Medium as ClickDuration | number,
    notationType: NotationType.Algebraic,
    useUnicodeIconsInNotation: true,
    showLegalMoves: true,
    showLastMove: true,
    showCheck: true,
    boardColor: ChessBoardColor.Green,
    boardBorder: ChessBoardBorder.None,
    boardRoundness: ChessBoardRoundness.Normal,
    boardOrientation: ChessBoardOrientation.PlayerBottom,
    pieceSet: PieceSet.Modern,
    piecesDisplaySize: PiecesDisplaySize.Medium as number, // TODO: For some reason, this gets turned into a string somewhere and i can't figure out where
    animationDuration: AnimationDuration.Medium as AnimationDuration | number,
    showCoordinates: true,
    lastMoveHighlightColor: HighlightColor.Yellow,
    selectedSquareHighlightColor: HighlightColor.Green,
    legalMoveHighlightColor: HighlightColor.White,
    userHighlightColor: HighlightColor.Red,
    userArrowColor: HighlightColor.Green,
  };

  const state = toRefs(
    useStorage("settings", defaults, localStorage, { mergeDefaults: true })
  );

  const reset = () => {
    const keys = Object.keys(defaults);
    // loop through all the keys in the defaults object and set them to their default values
    keys.forEach((key) => {
      // yes I know... but just spreading or using Object.assign doesn't work on an object with refs
      // @ts-ignore
      set(state[key], defaults[key]);
    });
  };

  return { ...state, reset };
});
