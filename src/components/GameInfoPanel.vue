<template>
  <div
    class="grow lg:my-16 bg-gray-100 dark:bg-gray-800 sm:rounded-3xl overflow-hidden flex flex-col"
  >
    <div
      class="p-2 flex flex-row items-center border-b-2 border-gray-200 dark:border-gray-700 overflow-x-auto overflow-y-hidden"
    >
      <button
        v-if="tabs.includes(GameInfoTab.Game)"
        @click="activeTab = GameInfoTab.Game"
        :aria-selected="activeTab === GameInfoTab.Game"
        class="px-6 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-md font-medium rounded-full transition-all ease-in-out"
      >
        Game
      </button>
      <button
        v-if="tabs.includes(GameInfoTab.Analysis)"
        @click="activeTab = GameInfoTab.Analysis"
        :aria-selected="activeTab === GameInfoTab.Analysis"
        class="px-6 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-md font-medium rounded-full transition-all ease-in-out"
      >
        Analysis
      </button>
      <button
        v-if="tabs.includes(GameInfoTab.Invite)"
        @click="activeTab = GameInfoTab.Invite"
        :aria-selected="activeTab === GameInfoTab.Invite"
        class="px-6 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-md font-medium rounded-full transition-all ease-in-out"
      >
        Invite
      </button>
      <button
        v-if="tabs.includes(GameInfoTab.Settings)"
        @click="activeTab = GameInfoTab.Settings"
        :aria-selected="activeTab === GameInfoTab.Settings"
        class="px-6 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-md font-medium rounded-full transition-all ease-in-out"
      >
        Settings
      </button>
    </div>
    <div class="flex-1 flex p-8 overflow-y-auto">
      <InfoPanelGameTab
        v-if="
          activeTab === GameInfoTab.Game || activeTab === GameInfoTab.Analysis
        "
        :is-player="isPlayer"
        :move-history="moveHistory"
        :active-color="activeColor"
        :game-has-started="gameHasStarted"
        :history-index="historyIndex"
        @time-travel-relative="emit('timeTravelRelative', $event)"
        @time-travel-absolute="emit('timeTravelAbsolute', $event)"
      />
      <InfoPanelInviteTab v-else-if="activeTab === GameInfoTab.Invite" />
      <InfoPanelSettingsTab v-else-if="activeTab === GameInfoTab.Settings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MoveItem } from "@/lib/types";
import type { PieceColor } from "@/lib/types";
import { ref } from "vue";
import InfoPanelGameTab from "@/components/infopanel/InfoPanelGameTab.vue";
import InfoPanelSettingsTab from "@/components/infopanel/InfoPanelSettingsTab.vue";
import InfoPanelInviteTab from "@/components/infopanel/InfoPanelInviteTab.vue";
import { set, watchOnce } from "@vueuse/core";
import { GameInfoTab } from "@/lib/types";

const props = defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  isPlayer: boolean;
  gameHasStarted: boolean;
  historyIndex: number;
  tabs: GameInfoTab[];
}>();

const emit = defineEmits<{
  (event: "timeTravelRelative", payload: number): void;
  (event: "timeTravelAbsolute", payload: number): void;
}>();

const activeTab = ref<GameInfoTab>(GameInfoTab.Invite);

if (!props.tabs.includes(GameInfoTab.Invite)) {
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
</script>
