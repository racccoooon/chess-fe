<template>
  <div
    class="flex flex-row items-center border-2 border-gray-200 dark:border-gray-700 p-1 rounded-full"
  >
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :aria-selected="modelValue === option.value"
      class="grow h-10 px-4 flex justify-center items-center text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-full transition-all ease-in-out"
    >
      {{ option.label }}
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
  }[];
}>();

defineEmits<{
  (event: "update:modelValue", value: any): void;
}>();
</script>
