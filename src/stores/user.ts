import { defineStore } from "pinia";
import { set, toRefs, useStorage } from "@vueuse/core";
import { v4 as uuid } from "uuid";
import { watch } from "vue";

export const useUserStore = defineStore("user", () => {
  const { token, name, hasSetName } = toRefs(
    useStorage(
      "user",
      {
        token: uuid(),
        name: `Player${Math.floor(Math.random() * 1000)}`,
        hasSetName: false,
      },
      localStorage,
      { mergeDefaults: true }
    )
  );

  watch(name, () => {
    set(hasSetName, true);
  });

  return { token, name, hasSetName };
});
