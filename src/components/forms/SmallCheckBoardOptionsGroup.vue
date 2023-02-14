<template>
  <div
    class="grid border-2 border-gray-200 dark:border-gray-700 p-2 rounded-3xl"
  >
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :aria-selected="modelValue === option.value"
      class="h-12 px-3 flex items-center gap-3 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-2xl transition-all ease-in-out"
    >
      <svg class="w-6 h-6 fill-green-300 rounded-md" viewBox="0 0 20 20">
        <rect width="10" height="10" x="0" y="0" :class="option.lightClass" />
        <rect width="10" height="10" x="10" y="0" :class="option.darkClass" />
        <rect width="10" height="10" x="00" y="10" :class="option.darkClass" />
        <rect width="10" height="10" x="10" y="10" :class="option.lightClass" />
      </svg>
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  modelValue: any;
  options: {
    label: string;
    value: any;
    lightClass: string;
    darkClass: string;
  }[];
}>();

defineEmits<{
  (event: "update:modelValue", value: any): void;
}>();
</script>
