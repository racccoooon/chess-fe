import { defineStore } from "pinia";
import { NotationType } from "@/lib/chessNotation";
import { ref, watch } from "vue";
import { get, set, useStorage } from "@vueuse/core";
import { ChessBoardBorder, ChessBoardColor } from "@/lib/types";

export const useSettingsStore = defineStore("settings", () => {
  // there must be a better way to do this...

  const settings = useStorage(
    "settings",
    {
      notationType: NotationType.Algebraic,
      useUnicodeIconsInNotation: true,
      raccoonMode: true,
      boardColor: ChessBoardColor.Green,
      boardBorder: ChessBoardBorder.None,
    },
    localStorage,
    { mergeDefaults: true }
  );

  const notationType = ref(get(settings).notationType);
  const useUnicodeIconsInNotation = ref(
    get(settings).useUnicodeIconsInNotation
  );
  const raccoonMode = ref(get(settings).raccoonMode);
  const boardColor = ref(get(settings).boardColor);
  const boardBorder = ref(get(settings).boardBorder);

  watch(settings, (newSettings) => {
    set(notationType, newSettings.notationType);
    set(useUnicodeIconsInNotation, newSettings.useUnicodeIconsInNotation);
    set(raccoonMode, newSettings.raccoonMode);
    set(boardColor, newSettings.boardColor);
    set(boardBorder, newSettings.boardBorder);
  });

  watch(notationType, (newNotationType) => {
    set(settings, { ...get(settings), notationType: newNotationType });
  });

  watch(useUnicodeIconsInNotation, (newUseUnicodeIconsInNotation) => {
    set(settings, {
      ...get(settings),
      useUnicodeIconsInNotation: newUseUnicodeIconsInNotation,
    });
  });

  watch(raccoonMode, (newRaccoonMode) => {
    set(settings, { ...get(settings), raccoonMode: newRaccoonMode });
  });

  watch(boardColor, (newBoardColor) => {
    set(settings, { ...get(settings), boardColor: newBoardColor });
  });

  watch(boardBorder, (newBoardBorder) => {
    set(settings, { ...get(settings), boardBorder: newBoardBorder });
  });

  return {
    notationType,
    useUnicodeIconsInNotation,
    raccoonMode,
    boardColor,
    boardBorder,
  };
});
