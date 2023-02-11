<template>
  <div class="grow flex flex-col gap-6">
    <div class="flex flex-col gap-6">
      <h2 class="text-gray-900 dark:text-gray-50 font-medium text-xl">
        Send this link to your opponent
      </h2>
      <input
        class="grow px-6 py-4 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-700 rounded-xl"
        :value="invitePlayerLink"
        ref="playerLinkInput"
        @focus="focusInput"
        readonly
      />
      <div class="flex flex-col-reverse sm:flex-row gap-4">
        <button
          @click="copyToClipboard"
          class="grow flex items-center justify-center px-8 py-3 h-16 rounded-2xl bg-green-300 border-b-4 active:border-b-0 active:border-t-4 border-green-600 text-green-900 shadow-xl shadow-green-600/40 font-medium text-lg transition-all ease-in-out"
        >
          Copy Link
        </button>
        <button
          @click="startShare"
          v-if="shareIsSupported"
          class="grow px-6 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 active:border-b-0 active:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-lg transition-all ease-in-out"
        >
          Share
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { get, useShare } from "@vueuse/core";

const playerLinkInput = ref<HTMLInputElement>();

const gameId = ref(useRoute().params.gameId as string);

const { share, isSupported: shareIsSupported } = useShare();

const invitePlayerLink = computed(() => {
  return `${window.location.origin}/play/${get(gameId)}`;
});

const startShare = () => {
  share({
    title: "Play chess with me!",
    text: "Join me in a game of chess!",
    url: get(invitePlayerLink),
  });
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(get(invitePlayerLink));
};

const focusInput = () => {
  get(playerLinkInput)?.select();
};
</script>
