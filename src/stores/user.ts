import { defineStore } from "pinia";
import { get, set, useStorage } from "@vueuse/core";
import { v4 as uuid } from "uuid";

export const useUserStore = defineStore("user", () => {
  const token = useStorage("playerToken", "");
  const name = useStorage("playerName", "");

  if (!get(token)) {
    set(token, uuid());
  }

  if (!get(name)) {
    set(name, `Player${Math.floor(Math.random() * 1000)}`);
  }

  return { token, name };
});
