<template>
  <div class="grow flex flex-col justify-between gap-8 h-min">
    <CompactFormWrapper>
      <CompactFormSection>
        <template #label>White Player Name</template>
        <CompactFormInputElement>
          <LargeTextInput
            :model-value="whitePlayerName || 'White'"
            @update:model-value="emit('update:whitePlayerName', $event)"
          />
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Black Player Name</template>
        <CompactFormInputElement>
          <LargeTextInput
            :model-value="blackPlayerName || 'Black'"
            @update:model-value="emit('update:blackPlayerName', $event)"
          />
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Setup</template>
        <template #description>
          The initial setup of the game in
          <b>Forsyth–Edwards Notation (FEN)</b>.
        </template>
        <CompactFormInputElement>
          <div class="flex flex-row gap-2">
            <LargeTextInput v-model="fenInput" />
            <LargeFlatSecondaryButton @click="fenInput = defaultFen">
              <SvgIcon type="mdi" :path="mdiUndoVariant" size="22" />
            </LargeFlatSecondaryButton>
          </div>
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Moves</template>
        <template #description>
          The moves of the game in <b>Standard Algebraic Notation (SAN)</b>.
        </template>
        <CompactFormInputElement>
          <div class="flex flex-row gap-2">
            <LargeTextInput v-model="notationInput" />
            <LargeFlatSecondaryButton @click="notationInput = ''">
              <SvgIcon type="mdi" :path="mdiUndoVariant" size="22" />
            </LargeFlatSecondaryButton>
          </div>
        </CompactFormInputElement>
      </CompactFormSection>
      <CompactFormSection>
        <template #label>Outcome</template>
        <template #description> The outcome of the game. </template>
        <CompactFormInputElement>
          <SmallPreviewOptionsGroup
            class="grid-cols-2"
            :model-value="gameResult || GameResult.Unknown"
            @update:model-value="emit('update:gameResult', $event)"
            :options="[
              { value: GameResult.WhiteWins, label: 'White Won' },
              { value: GameResult.BlackWins, label: 'Black Won' },
              { value: GameResult.Draw, label: 'Draw' },
              { value: GameResult.InProgress, label: 'Ongoing' },
            ]"
          >
            <template #label="option">
              <span class="ml-2 font-bold text-sm text-black dark:text-white">
                {{ gameResultNotation[option.value] || "*" }}
              </span>
              <span>
                {{ option.label }}
              </span>
            </template>
          </SmallPreviewOptionsGroup>
        </CompactFormInputElement>
      </CompactFormSection>
    </CompactFormWrapper>
    <LargePrimaryButton @click="importGame">
      <span>Import</span>
      <SvgIcon type="mdi" :path="mdiImport" size="22" />
    </LargePrimaryButton>
  </div>
</template>

<script setup lang="ts">
import LargeTextInput from "@/components/forms/LargeTextInput.vue";
import CompactFormWrapper from "@/components/forms/CompactFormWrapper.vue";
import CompactFormSection from "@/components/forms/CompactFormSection.vue";
import CompactFormInputElement from "@/components/forms/CompactFormInputElement.vue";
import type { ImportGameEvent, MoveItem } from "@/lib/types";
import { computed, ref } from "vue";
import {
  getGameNotation,
  NotationType,
  gameResultNotation,
} from "@/lib/chessNotation";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiUndoVariant, mdiImport } from "@mdi/js";
import { get, syncRefs } from "@vueuse/core";
import LargePrimaryButton from "@/components/forms/LargePrimaryButton.vue";
import { defaultFen, fenToPieces } from "@/lib/chess";
import LargeFlatSecondaryButton from "@/components/forms/LargeFlatSecondaryButton.vue";
import SmallPreviewOptionsGroup from "@/components/forms/SmallPreviewOptionsGroup.vue";
import { GameResult } from "@/lib/types";

const props = defineProps<{
  setupFen?: string;
  moveHistory?: MoveItem[];
  whitePlayerName?: string;
  blackPlayerName?: string;
  gameResult?: GameResult;
}>();

const emit = defineEmits<{
  (event: "importGame", payload: ImportGameEvent): void;
  (event: "update:whitePlayerName", payload: string): void;
  (event: "update:blackPlayerName", payload: string): void;
  (event: "update:gameResult", payload: GameResult): void;
}>();

const fenInput = ref<string>("");
const notationInput = ref<string>("");

const notation = computed(() => {
  if (!props.moveHistory) return "";
  return getGameNotation(
    props.moveHistory,
    NotationType.Algebraic,
    true,
    fenToPieces(props.setupFen || defaultFen)
  );
});

syncRefs(() => props.setupFen || defaultFen, fenInput);
syncRefs(notation, notationInput);

const importGame = () => {
  emit("importGame", {
    san: get(notationInput),
    fen: get(fenInput),
  });
};
</script>
