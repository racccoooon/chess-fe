import { defineStore } from "pinia";
import { NotationType } from "@/lib/chessNotation";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const notationType = ref(NotationType.Algebraic);
  const useUnicodeIconsInNotation = ref(true);
  const raccoonMode = ref(true);

  return {
    notationType,
    useUnicodeIconsInNotation,
    raccoonMode,
  };
});
