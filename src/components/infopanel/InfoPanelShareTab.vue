<template>
  <div class="grow h-min">
    <CompactFormWrapper>
      <CompactFormSection>
        <template #label> Send this link to your opponent</template>
        <template #description>
          The first person to click this link will be your opponent.
        </template>
        <CompactFormInputElement>
          <HorizontalInputGroup>
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
          </HorizontalInputGroup>
          <QRCodeDisplay :text="inviteOpponentLink" alt="QRCode for opponent" />
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Send this link to spectators</template>
        <template #description>
          Anyone with this link can watch your game.
        </template>
        <CompactFormInputElement>
          <HorizontalInputGroup>
            <LargeTextInput
              v-model="inviteSpectatorsLink"
              ref="opponentLinkInput"
              readonly
            />
            <LargeFlatSecondaryButton
              @click="copySpectatorsLinkToClipboard"
              class="grow"
              alt="copy link"
            >
              <SvgIcon type="mdi" :path="mdiContentCopy" size="18" />
            </LargeFlatSecondaryButton>
          </HorizontalInputGroup>
          <QRCodeDisplay
            :text="inviteSpectatorsLink"
            alt="QRCode for spectators"
          />
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Permanent link to this game</template>
        <template #description v-if="permanentLink">
          This link will always point to this game, even after it is finished.
          forever.
        </template>
        <template #description v-else> Go play the game first.</template>
        <CompactFormInputElement>
          <HorizontalInputGroup>
            <LargeTextInput
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
          </HorizontalInputGroup>
        </CompactFormInputElement>
      </CompactFormSection>
    </CompactFormWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { get, set, useEventBus, watchDebounced } from "@vueuse/core";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiContentCopy, mdiOpenInNew } from "@mdi/js";
import LargeTextInput from "@/components/forms/LargeTextInput.vue";
import LargeFlatSecondaryButton from "@/components/forms/LargeFlatSecondaryButton.vue";
import type { MoveItem } from "@/lib/types";
import { getGameNotation, NotationType } from "@/lib/chessNotation";
import { toastBusKey } from "@/lib/eventBus";
import QRCodeDisplay from "@/components/forms/QRCodeDisplay.vue";
import CompactFormWrapper from "@/components/forms/CompactFormWrapper.vue";
import CompactFormSection from "@/components/forms/CompactFormSection.vue";
import HorizontalInputGroup from "@/components/forms/HorizontalInputGroup.vue";
import CompactFormInputElement from "@/components/forms/CompactFormInputElement.vue";

const props = defineProps<{
  moveHistory?: MoveItem[];
  whitePlayerName?: string;
  blackPlayerName?: string;
  setupFen?: string;
}>();

const router = useRouter();

const toastHub = useEventBus(toastBusKey);

const gameId = ref(useRoute().params.gameId as string);

const inviteOpponentLink = computed(() => {
  return `${window.location.origin}/${get(gameId)}`;
});

const inviteSpectatorsLink = computed(() => {
  return `${window.location.origin}/spectate/${get(gameId)}`;
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
        fen: props.setupFen,
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
  toastHub.emit({
    message: "Copied link to clipboard!",
  });
};

const copySpectatorsLinkToClipboard = () => {
  navigator.clipboard.writeText(get(inviteSpectatorsLink));
  toastHub.emit({
    message: "Copied link to clipboard!",
  });
};

const copyPermanentLinkToClipboard = () => {
  navigator.clipboard.writeText(get(permanentLink));
  toastHub.emit({
    message: "Copied link to clipboard!",
  });
};

onMounted(() => {
  getPermanentLink();
});
</script>
