<template>
  <div class="fixed bottom-8 right-8 z-50 flex flex-col gap-2 sm:gap-4">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="flex flex-col gap-2 bg-gray-200 dark:bg-gray-800 text-white rounded-2xl shadow-xl shadow-gray-800/50 p-6 sm:w-80"
    >
      <h2 class="text-lg font-medium">{{ toast.title }}</h2>
      <p class="text-gray-700 dark:text-gray-200">{{ toast.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { get, useEventBus } from "@vueuse/core";
import { toastBusKey } from "@/lib/eventBus";
import { ref } from "vue";
import type { ToastKeyed } from "@/lib/types";

const bus = useEventBus(toastBusKey);

const toasts = ref<ToastKeyed[]>([]);

bus.on((e) => {
  const id = Math.random().toString(36).substr(2, 9);

  get(toasts).push({
    id,
    ...e,
  });

  // Remove toast after 4 seconds
  setTimeout(() => {
    get(toasts).splice(
      get(toasts).findIndex((t) => t.id === id),
      1
    );
  }, 4000);

  // limit to 3 toasts
  if (get(toasts).length > 3) {
    get(toasts).shift();
  }
});
</script>
