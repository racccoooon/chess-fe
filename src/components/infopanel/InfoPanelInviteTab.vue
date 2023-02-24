<template>
  <div class="grow flex flex-col gap-6">
    <div class="flex flex-col gap-6">
      <h2 class="text-gray-900 dark:text-gray-50 font-medium text-xl mb-2">
        Send this link to your opponent
      </h2>
      <div class="flex flex-col md:flex-row gap-4 md:gap-2">
        <input
          class="grow px-6 py-4 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-700 rounded-xl"
          :value="invitePlayerLink"
          ref="playerLinkInput"
          @focus="focusInput"
          readonly
        />
        <LargePrimaryButton
          @click="copyToClipboard"
          class="grow"
          alt="copy link"
        >
          <SvgIcon type="mdi" :path="mdiContentCopy" size="18" />
        </LargePrimaryButton>
      </div>
      <div
        class="h-min p-2 flex flex-row justify-center rounded-lg overflow-hidden bg-white"
      >
        <img
          ref="opponentQrCodeImg"
          class="w-full md:w-1/3 xl:w-2/5"
          src=""
          alt="Opponent Link QrCode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { get, whenever } from "@vueuse/core";
import LargePrimaryButton from "@/components/forms/LargePrimaryButton.vue";
// @ts-ignore
import QRCode from "qrcode";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiContentCopy } from "@mdi/js";

const playerLinkInput = ref<HTMLInputElement>();

const gameId = ref(useRoute().params.gameId as string);

const opponentQrCodeImg = ref();

const invitePlayerLink = computed(() => {
  return `${window.location.origin}/play/${get(gameId)}`;
});

const copyToClipboard = () => {
  navigator.clipboard.writeText(get(invitePlayerLink));
};

const focusInput = () => {
  get(playerLinkInput)?.select();
};

const generateQrCode = () => {
  QRCode.toDataURL(get(invitePlayerLink), {}, (err: any, url: any) => {
    if (err) throw err;

    get(opponentQrCodeImg).src = url;
  });
};

watch(invitePlayerLink, () => {
  generateQrCode();
});

whenever(opponentQrCodeImg, () => {
  generateQrCode();
});
</script>
