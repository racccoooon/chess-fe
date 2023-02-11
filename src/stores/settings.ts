import { defineStore } from "pinia";
import { NotationType } from "@/lib/chessNotation";
import { ref, watch } from "vue";
import { get, set, useStorage } from "@vueuse/core";
import { ChessBoardBorder } from "@/lib/types";

export const useSettingsStore = defineStore("settings", () => {
  // there must be a better way to do this...

  const settings = useStorage(
    "settings",
    {
      notationType: NotationType.Algebraic,
      useUnicodeIconsInNotation: true,
      raccoonMode: true,
      chessBoardBorder: ChessBoardBorder.Thin,
    },
    localStorage,
    { mergeDefaults: true }
  );

  const notationType = ref(get(settings).notationType);
  const useUnicodeIconsInNotation = ref(
    get(settings).useUnicodeIconsInNotation
  );
  const raccoonMode = ref(get(settings).raccoonMode);
  const chessBoardBorder = ref(get(settings).chessBoardBorder);

  watch(settings, (newSettings) => {
    set(notationType, newSettings.notationType);
    set(useUnicodeIconsInNotation, newSettings.useUnicodeIconsInNotation);
    set(raccoonMode, newSettings.raccoonMode);
    set(chessBoardBorder, newSettings.chessBoardBorder);
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

  watch(chessBoardBorder, (newChessBoardBorder) => {
    set(settings, { ...get(settings), chessBoardBorder: newChessBoardBorder });
  });

  return {
    notationType,
    useUnicodeIconsInNotation,
    raccoonMode,
    chessBoardBorder,
  };
});
