<template>
  <div
    class="grow lg:my-16 p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col gap-6"
  >
    <div class="flex flex-row gap-2 items-center">
      <button
        @click="activeTab = Tab.Game"
        :aria-selected="activeTab === Tab.Game"
        class="px-4 p-1 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 text-lg font-medium"
      >
        Game
      </button>
      <button
        @click="activeTab = Tab.Settings"
        :aria-selected="activeTab === Tab.Settings"
        class="px-4 p-1 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 text-lg font-medium"
      >
        Settings
      </button>
    </div>
    <InfoPanelGameTab
      v-if="activeTab === Tab.Game"
      :is-player="isPlayer"
      :move-history="moveHistory"
      :active-color="activeColor"
    />
    <InfoPanelSettingsTab v-else-if="activeTab === Tab.Settings" />
  </div>
</template>

<script setup lang="ts">
import type { MoveItem } from "@/lib/types";
import { PieceColor } from "@/lib/types";
import { ref } from "vue";
import InfoPanelGameTab from "@/components/infopanel/InfoPanelGameTab.vue";
import InfoPanelSettingsTab from "@/components/infopanel/InfoPanelSettingsTab.vue";

defineProps<{
  moveHistory: MoveItem[];
  activeColor: PieceColor;
  isPlayer: boolean;
}>();

enum Tab {
  Game,
  Settings,
}

const activeTab = ref<Tab>(Tab.Game);
</script>
