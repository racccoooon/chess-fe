<template>
  <div
    class="grow lg:my-16 bg-gray-100 dark:bg-gray-800 sm:rounded-3xl overflow-hidden flex flex-col"
  >
    <div
      class="p-2 flex flex-row items-center border-b-2 border-gray-200 dark:border-gray-700 overflow-x-auto overflow-y-hidden"
    >
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :aria-selected="activeTab === tab"
        class="px-6 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-md font-medium rounded-full transition-all ease-in-out"
      >
        {{ tabNames[tab] }}
      </button>
    </div>
    <div class="flex-1 flex p-8 overflow-y-auto">
      <InfoPanelGameTab
        v-if="activeTab === GameInfoTab.Game"
        :is-player="isPlayer"
        :move-history="moveHistory"
        :active-color="activeColor"
        :game-has-started="gameHasStarted"
        :history-index="historyIndex"
        @time-travel-relative="emit('timeTravelRelative', $event)"
        @time-travel-absolute="emit('timeTravelAbsolute', $event)"
      />
      <InfoPanelAnalysisTab
        v-else-if="activeTab === GameInfoTab.Analysis"
        :move-history="moveHistory"
        :active-color="activeColor"
        :history-index="historyIndex"
        @time-travel-relative="emit('timeTravelRelative', $event)"
        @time-travel-absolute="emit('timeTravelAbsolute', $event)"
      />
      <InfoPanelEditTab
        v-else-if="activeTab === GameInfoTab.Edit"
        :pointer-mode="pointerMode"
        @update:pointer-mode="emit('update:pointerMode', $event)"
        :paint-piece-color="paintPieceColor"
        @update:paint-piece-color="emit('update:paintPieceColor', $event)"
        :paint-piece-type="paintPieceType"
        @update:paint-piece-type="emit('update:paintPieceType', $event)"
      />
      <InfoPanelGameSetupTab
        v-else-if="activeTab === GameInfoTab.GameSetup"
        @import-game="emit('importGame', $event)"
        :move-history="moveHistory"
        :white-player-name="whitePlayerName"
        @update:white-player-name="emit('update:whitePlayerName', $event)"
        :black-player-name="blackPlayerName"
        @update:black-player-name="emit('update:blackPlayerName', $event)"
        :setup-fen="setupFen"
      />
      <InfoPanelShareTab
        v-else-if="activeTab === GameInfoTab.Share"
        :move-history="moveHistory"
        :white-player-name="whitePlayerName"
        :black-player-name="blackPlayerName"
      />
      <InfoPanelSettingsTab v-else-if="activeTab === GameInfoTab.Settings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MoveItem } from "@/lib/types";
import type { PieceColor } from "@/lib/types";
import { ref, watch } from "vue";
import InfoPanelGameTab from "@/components/infopanel/InfoPanelGameTab.vue";
import InfoPanelSettingsTab from "@/components/infopanel/InfoPanelSettingsTab.vue";
import InfoPanelShareTab from "@/components/infopanel/InfoPanelShareTab.vue";
import { set, watchOnce } from "@vueuse/core";
import { BoardPointerMode, GameInfoTab, PieceType } from "@/lib/types";
import type { ImportGameEvent } from "@/lib/types";
import InfoPanelGameSetupTab from "@/components/infopanel/InfoPanelGameSetupTab.vue";
import InfoPanelAnalysisTab from "@/components/infopanel/InfoPanelAnalysisTab.vue";
import InfoPanelEditTab from "@/components/infopanel/InfoPanelEditTab.vue";

const props = defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  isPlayer: boolean;
  gameHasStarted: boolean;
  historyIndex: number;
  whitePlayerName: string;
  blackPlayerName: string;
  setupFen: string;
  pointerMode: BoardPointerMode;
  paintPieceType: PieceType;
  paintPieceColor: PieceColor;
  tabs: GameInfoTab[];
}>();

const emit = defineEmits<{
  (event: "timeTravelRelative", payload: number): void;
  (event: "timeTravelAbsolute", payload: number): void;
  (event: "importGame", payload: ImportGameEvent): void;
  (event: "update:whitePlayerName", payload: string): void;
  (event: "update:blackPlayerName", payload: string): void;
  (event: "update:pointerMode", payload: BoardPointerMode): void;
  (event: "update:paintPieceType", payload: PieceType): void;
  (event: "update:paintPieceColor", payload: PieceColor): void;
}>();

const activeTab = ref<GameInfoTab>(GameInfoTab.Share);

if (!props.tabs.includes(GameInfoTab.Share)) {
  if (props.tabs.includes(GameInfoTab.Game)) {
    set(activeTab, GameInfoTab.Game);
  } else if (props.tabs.includes(GameInfoTab.Analysis)) {
    set(activeTab, GameInfoTab.Analysis);
  } else {
    set(activeTab, GameInfoTab.Settings);
  }
}

watchOnce(
  () => props.gameHasStarted,
  () => {
    set(activeTab, GameInfoTab.Game);
  }
);

const tabNames: Record<GameInfoTab, string> = {
  [GameInfoTab.Game]: "Game",
  [GameInfoTab.Analysis]: "Analysis",
  [GameInfoTab.Edit]: "Edit",
  [GameInfoTab.GameSetup]: "Setup",
  [GameInfoTab.Share]: "Share",
  [GameInfoTab.Settings]: "Settings",
};

watch(activeTab, () => {
  emit("update:pointerMode", BoardPointerMode.Move);
});
</script>
