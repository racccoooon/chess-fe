<template>
  <div
    class="grid border-2 border-gray-200 dark:border-gray-700 p-1 rounded-3xl"
  >
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :aria-selected="modelValue === option.value"
      class="h-12 px-3 flex items-center gap-3 text-gray-500 dark:text-gray-300 aria-selected:text-gray-900 aria-selected:dark:text-gray-50 aria-selected:bg-gray-200 aria-selected:dark:bg-gray-700 text-sm font-medium rounded-[1.25rem] transition-all ease-in-out"
    >
      <span class="w-6 h-6 rounded-lg overflow-hidden">
        <slot v-bind="option" name="preview" />
      </span>
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
    userOptions: object;
  }[];
}>();

defineEmits<{
  (event: "update:modelValue", value: any): void;
}>();
</script>
