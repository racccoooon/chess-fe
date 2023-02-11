<template>
  <div
    class="grow lg:my-16 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col"
  >
    <div
      class="p-2 flex flex-row items-center border-b-2 border-gray-200 dark:border-gray-700 overflow-x-auto"
    >
      <button
        @click="activeTab = Tab.Game"
        :aria-selected="activeTab === Tab.Game"
        class="px-6 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-md font-medium rounded-xl transition-all ease-in-out"
      >
        Game
      </button>
      <button
        @click="activeTab = Tab.Invite"
        :aria-selected="activeTab === Tab.Invite"
        class="px-6 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-md font-medium rounded-xl transition-all ease-in-out"
      >
        Invite
      </button>
      <button
        @click="activeTab = Tab.Settings"
        :aria-selected="activeTab === Tab.Settings"
        class="px-6 py-2 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-md font-medium rounded-xl transition-all ease-in-out"
      >
        Settings
      </button>
    </div>
    <div class="grow flex p-8">
      <InfoPanelGameTab
        v-if="activeTab === Tab.Game"
        :is-player="isPlayer"
        :move-history="moveHistory"
        :active-color="activeColor"
        :game-has-started="gameHasStarted"
      />
      <InfoPanelInviteTab v-else-if="activeTab === Tab.Invite" />
      <InfoPanelSettingsTab v-else-if="activeTab === Tab.Settings" />
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

const props = defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  isPlayer: boolean;
  gameHasStarted: boolean;
}>();

enum Tab {
  Game,
  Invite,
  Settings,
}

const activeTab = ref<Tab>(Tab.Invite);

watchOnce(
  () => props.gameHasStarted,
  () => {
    set(activeTab, Tab.Game);
  }
);
</script>
