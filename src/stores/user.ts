import { defineStore } from "pinia";
import { toRefs, useStorage } from "@vueuse/core";
import { v4 as uuid } from "uuid";

export const useUserStore = defineStore("user", () => {
  return toRefs(
    useStorage(
      "user",
      {
        token: uuid(),
        name: `Player${Math.floor(Math.random() * 1000)}`,
      },
      localStorage,
      { mergeDefaults: true }
    )
  );
});
