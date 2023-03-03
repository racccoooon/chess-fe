<template>
  <div class="grow flex flex-col gap-12 h-min">
    <div class="flex flex-col gap-6">
      <h2 class="text-gray-900 dark:text-gray-50 font-medium text-xl">
        Send this link to your opponent
      </h2>
      <div class="flex flex-row gap-2">
        <LargeTextInput
          v-model="inviteOpponentLink"
          ref="opponentLinkInput"
          readonly
        />
        <LargeFlatSecondaryButton
          @click="copyOpponentLinkToClipboard"
          class="grow"
          alt="copy link"
        >
          <SvgIcon type="mdi" :path="mdiContentCopy" size="18" />
        </LargeFlatSecondaryButton>
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
    <div class="flex flex-col gap-6">
      <h2 class="text-gray-900 dark:text-gray-50 font-medium text-xl">
        Permanent link to this game
      </h2>
      <div class="flex flex-row gap-2">
        <LargeTextInput
          class="grow px-6 py-4 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-700 rounded-xl"
          v-model="permanentLink"
          ref="permanentLinkInput"
          readonly
        />
        <LargeFlatSecondaryButton
          class="grow"
          alt="open in new tab"
          :href="permanentLink"
          target="_blank"
        >
          <SvgIcon type="mdi" :path="mdiOpenInNew" size="18" />
        </LargeFlatSecondaryButton>
        <LargeFlatSecondaryButton
          @click="copyPermanentLinkToClipboard"
          class="grow"
          alt="copy link"
        >
          <SvgIcon type="mdi" :path="mdiContentCopy" size="18" />
        </LargeFlatSecondaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { get, set, watchDebounced } from "@vueuse/core";
// @ts-ignore
import QRCode from "qrcode";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiContentCopy, mdiOpenInNew } from "@mdi/js";
import LargeTextInput from "@/components/forms/LargeTextInput.vue";
import LargeFlatSecondaryButton from "@/components/forms/LargeFlatSecondaryButton.vue";
import type { MoveItem } from "@/lib/types";
import { getGameNotation, NotationType } from "@/lib/chessNotation";

const props = defineProps<{
  moveHistory?: MoveItem[];
  whitePlayerName?: string;
  blackPlayerName?: string;
}>();

const router = useRouter();

const gameId = ref(useRoute().params.gameId as string);

const opponentQrCodeImg = ref<HTMLImageElement>();

const inviteOpponentLink = computed(() => {
  return `${window.location.origin}/play/${get(gameId)}`;
});

const permanentLink = ref("");

const getPermanentLink = () => {
  if (
    !props.moveHistory?.length ||
    !props.whitePlayerName ||
    !props.blackPlayerName
  ) {
    return;
  }

  const notation = getGameNotation(
    props.moveHistory,
    NotationType.Algebraic,
    false
  );

  const san = notation.split(" ").join("/");

  const url =
    window.location.origin +
    router.resolve({
      name: "sandbox-board",
      query: {
        white: props.whitePlayerName,
        black: props.blackPlayerName,
        moves: san,
      },
    }).href;

  set(permanentLink, url);
};

watchDebounced(() => props.moveHistory, getPermanentLink, {
  immediate: true,
  deep: true,
  debounce: 500,
  maxWait: 1000,
});

const copyOpponentLinkToClipboard = () => {
  navigator.clipboard.writeText(get(inviteOpponentLink));
};

const copyPermanentLinkToClipboard = () => {
  navigator.clipboard.writeText(get(permanentLink));
};

const generateOpponentQrCode = () => {
  if (!get(opponentQrCodeImg)) return;

  QRCode.toDataURL(get(inviteOpponentLink), {}, (err: any, url: any) => {
    if (err) throw err;

    get(opponentQrCodeImg)!.src = url;
  });
};

watch([inviteOpponentLink, opponentQrCodeImg], () => {
  generateOpponentQrCode();
});

onMounted(() => {
  generateOpponentQrCode();
  getPermanentLink();
});
</script>
