<template>
  <div
    class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-24 flex flex-col gap-12"
  >
    <div
      class="p-24 flex flex-col gap-12 bg-gray-100 dark:bg-gray-800 rounded-2xl"
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
      class="p-24 flex flex-col gap-12 bg-gray-100 dark:bg-gray-800 rounded-2xl"
    >
      <div class="flex flex-wrap justify-between gap-8">
        <div class="flex flex-row gap-4 items-center">
          <h2 class="font-medium text-lg">You Play As</h2>
          <button
            @click="selectedColor = ColorOptions.White"
            :aria-selected="selectedColor === ColorOptions.White"
            class="w-24 h-16 rounded-2xl bg-gray-200 border-b-4 active:border-b-0 active:border-t-4 border-gray-300 text-gray-900 font-medium text-md aria-selected:outline outline-3 outline-pink-500 outline-offset-4 transition-all ease-in-out"
          >
            White
          </button>
          <button
            @click="selectedColor = ColorOptions.Black"
            :aria-selected="selectedColor === ColorOptions.Black"
            class="w-24 h-16 rounded-2xl bg-gray-700 border-b-4 active:border-b-0 active:border-t-4 border-gray-900 text-gray-50 font-medium text-md aria-selected:outline outline-3 outline-pink-500 outline-offset-4 transition-all ease-in-out"
          >
            Black
          </button>
          <button
            @click="selectedColor = ColorOptions.Random"
            :aria-selected="selectedColor === ColorOptions.Random"
            class="w-24 h-16 rounded-2xl bg-gray-700 border-b-4 active:border-b-0 active:border-t-4 border-gray-900 text-gray-50 font-medium text-md aria-selected:outline outline-3 outline-pink-500 outline-offset-4 transition-all ease-in-out"
          >
            Random
          </button>
        </div>
        <div class="flex">
          <button
            @click="createGame"
            class="px-6 py-3 rounded-2xl bg-green-300 border-b-4 active:border-b-0 active:border-t-4 border-green-600 text-green-900 font-medium text-lg transition-all ease-in-out"
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

enum ColorOptions {
  White = "white",
  Black = "black",
  Random = "random",
}

const router = useRouter();
const playerName = ref("");
const selectedColor = ref(ColorOptions.White);
const gameId = ref("");

const createGame = async () => {
  let game = await createGameApi();

  await router.push({
    name: "play",
    params: { gameId: game.gameId },
    state: { token: game.token, playerName: game.playerName },
  });
};

const join = async () => {
  await router.push({ name: "play", params: { gameId: gameId.value } });
};
</script>
