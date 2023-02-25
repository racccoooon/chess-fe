<template>
  <div class="p-6 md:p-12 lg:p-16 bg-gray-100 dark:bg-gray-800 md:rounded-3xl">
    <div class="flex flex-col gap-8 lg:gap-12">
      <LargePrimaryButton class="w-full" @click="createGame">
        Start Playing <SvgIcon type="mdi" :path="mdiArrowRight" />
      </LargePrimaryButton>
      <div class="flex flex-col gap-6">
        <h2 class="text-xl font-bold">You play as</h2>
        <LargeOptionsGroup
          v-model="startColor"
          :options="[
            { label: 'White', value: GameStartColor.White },
            { label: 'Black', value: GameStartColor.Black },
            { label: 'Random', value: GameStartColor.Random },
          ]"
        >
          <template #preview="option">
            <PieceRenderer
              v-if="
                option.value === GameStartColor.White ||
                option.value === GameStartColor.Black
              "
              :color="
                option.value === GameStartColor.White
                  ? PieceColor.White
                  : PieceColor.Black
              "
              :type="PieceType.Pawn"
              class="w-12"
            />
            <span v-else>
              <PieceRenderer
                :color="PieceColor.White"
                :type="PieceType.Pawn"
                class="absolute w-12 masked"
              />
              <PieceRenderer
                :color="PieceColor.Black"
                :type="PieceType.Pawn"
                class="w-12"
              />
            </span>
          </template>
        </LargeOptionsGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LargePrimaryButton from "@/components/forms/LargePrimaryButton.vue";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiArrowRight } from "@mdi/js";
import LargeOptionsGroup from "@/components/forms/LargeOptionsGroup.vue";
import { GameStartColor, PieceColor, PieceType } from "@/lib/types";
import PieceRenderer from "@/components/pieces/PieceRenderer.vue";
import { ref } from "vue";
import { createGame as createGameApi } from "@/lib/api";
import { get } from "@vueuse/core";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const store = useUserStore();

const { name: playerName } = store;

const router = useRouter();

const startColor = ref(GameStartColor.White);

const createGame = async () => {
  let game = await createGameApi(get(startColor));

  store.$patch({
    name: get(playerName),
  });

  await router.push({
    name: "play",
    params: { gameId: game.gameId },
  });
};
</script>

<style scoped>
.masked {
  mask-image: linear-gradient(
    -202.5deg,
    black 0%,
    black 50%,
    transparent 50%,
    transparent 100%
  );
  mask-size: 100%;
  mask-repeat: no-repeat;
  mask-position: center;
}
</style>
