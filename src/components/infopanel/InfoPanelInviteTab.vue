<template>
  <div class="grow flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <h2 class="text-gray-900 dark:text-gray-50 font-medium">
        Send this link to your opponent
      </h2>
      <input
        class="grow px-6 py-4 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-700 rounded-xl"
        :value="invitePlayerLink"
        ref="playerLinkInput"
        @focus="focusInput"
        readonly
      />
      <div class="flex flex-row gap-4">
        <button
          @click="copyToClipboard"
          class="grow px-6 py-4 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Copy Link
        </button>
        <button
          @click="startShare"
          v-if="shareIsSupported"
          class="grow px-6 py-4 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-xl transition-all ease-in-out"
        >
          Open Share Menu
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
