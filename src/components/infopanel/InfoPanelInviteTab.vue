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
        <LargePrimaryButton @click="copyToClipboard" class="grow">
          Copy Link
        </LargePrimaryButton>
        <LargeSecondaryButton
          @click="startShare"
          v-if="shareIsSupported"
          class="grow"
        >
          Share
        </LargeSecondaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { get, useShare } from "@vueuse/core";
import LargePrimaryButton from "@/components/forms/LargePrimaryButton.vue";
import LargeSecondaryButton from "@/components/forms/LargeSecondaryButton.vue";

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
