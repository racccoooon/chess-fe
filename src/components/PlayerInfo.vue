<template>
  <div class="p-6 flex flex-col gap-2">
    <h2 class="text-gray-900 dark:text-gray-50 text-xl font-bold">
      {{ name || "Player" }}
    </h2>
    <span v-if="materialAdvantage > 0" class="text-gray-500 dark:text-gray-300"
      >+{{ materialAdvantage }}</span
    >
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  materialAdvantage: number;
}>();
</script>
