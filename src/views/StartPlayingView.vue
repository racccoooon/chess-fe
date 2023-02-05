<template>
  <div class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl py-24">
    <div
      class="p-24 flex flex-col gap-12 bg-gray-100 dark:bg-gray-800 rounded-2xl"
    >
      <div>
        <button
          @click="createGame"
          class="px-6 py-3 rounded-2xl bg-gray-700 border-b-4 border-gray-900 text-gray-50 font-medium text-lg"
        >
          Create A New Game
        </button>
      </div>
      <div>
        <p class="text-lg font-medium text-gray-300 dark:text-gray-600">or</p>
      </div>
      <div class="flex flex-wrap gap-4 items-center">
        <input
          v-model="gameId"
          type="text"
          placeholder="Game ID"
          class="px-6 py-3 rounded-2xl bg-gray-700 border-t-4 border-gray-900 text-gray-50 font-medium text-lg"
        />
        <button
          @click="join"
          class="px-6 py-3 rounded-2xl bg-gray-700 border-b-4 border-gray-900 text-gray-50 font-medium text-lg"
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

const router = useRouter();
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
