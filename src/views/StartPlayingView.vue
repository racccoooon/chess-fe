<template>
  <div
    class="mx-3 sm:mx-auto sm:w-3/4 lg:w-1/2 max-w-7xl py-24 flex flex-col gap-12"
  >
    <div
      class="p-16 flex flex-col gap-12 bg-gray-100 dark:bg-gray-800 rounded-3xl"
    >
      <div class="flex flex-row gap-4 items-center">
        <h2 class="font-medium text-lg">Your Name</h2>
        <input
          v-model="playerName"
          type="text"
          placeholder="ChessMaster3000"
          class="px-6 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-lg"
        />
      </div>
    </div>
    <div
      class="p-16 flex flex-col gap-12 bg-gray-100 dark:bg-gray-800 rounded-3xl"
    >
      <div class="flex flex-col justify-between gap-12">
        <div class="flex flex-col gap-4">
          <label class="font-medium text-lg">You Play As</label>
          <div class="flex flex-row gap-4 items-center">
            <button
              @click="selectedColor = GameStartColor.White"
              :aria-selected="selectedColor === GameStartColor.White"
              class="w-24 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 active:border-b-0 active:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 shadow-xl aria-selected:shadow-pink-600/40 font-medium text-md aria-selected:outline outline-3 outline-pink-500 outline-offset-0 transition-all ease-in-out"
            >
              White
            </button>
            <button
              @click="selectedColor = GameStartColor.Black"
              :aria-selected="selectedColor === GameStartColor.Black"
              class="w-24 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 active:border-b-0 active:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 shadow-xl aria-selected:shadow-pink-600/40 font-medium text-md aria-selected:outline outline-3 outline-pink-500 outline-offset-0 transition-all ease-in-out"
            >
              Black
            </button>
            <button
              @click="selectedColor = GameStartColor.Random"
              :aria-selected="selectedColor === GameStartColor.Random"
              class="w-24 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 active:border-b-0 active:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 shadow-xl aria-selected:shadow-pink-600/40 font-medium text-md aria-selected:outline outline-3 outline-pink-500 outline-offset-0 transition-all ease-in-out"
            >
              Random
            </button>
          </div>
        </div>
        <div class="w-full">
          <button
            @click="createGame"
            class="flex items-center justify-center px-8 py-3 h-16 rounded-2xl bg-green-300 border-b-4 active:border-b-0 active:border-t-4 border-green-600 text-green-900 shadow-xl shadow-green-600/40 font-medium text-lg transition-all ease-in-out w-full"
          >
            Create A New Game
          </button>
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <hr
          class="w-1/6 border-b-[1.5px] border-gray-300 dark:border-gray-600 translate-y-4"
        />
        <p class="text-lg font-medium text-gray-300 dark:text-gray-600">or</p>
        <hr
          class="flex-1 border-b-[1.5px] border-gray-300 dark:border-gray-600 translate-y-4"
        />
      </div>
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1">
          <input
            v-model="gameId"
            type="text"
            placeholder="Game ID"
            class="w-full px-6 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-lg"
          />
        </div>
        <button
          @click="join"
          class="px-6 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 active:border-b-0 active:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-lg transition-all ease-in-out"
        >
          Join Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createGame as createGameApi } from "@/lib/api";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { GameStartColor } from "@/lib/types";
import { get } from "@vueuse/core";
import { useUserStore } from "@/stores/player";

const store = useUserStore();

const router = useRouter();
const playerName = ref(store.name);
const selectedColor = ref(GameStartColor.White);
const gameId = ref("");

const createGame = async () => {
  let game = await createGameApi(get(selectedColor));

  store.$patch({
    name: get(playerName),
  });

  await router.push({
    name: "play",
    params: { gameId: game.gameId },
  });
};

const join = async () => {
  await router.push({ name: "play", params: { gameId: gameId.value } });
};
</script>
