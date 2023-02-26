<template>
  <div>
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :aria-selected="modelValue === option.value"
      class="grow flex flex-row items-center gap-2 p-4 md:h-18 flex bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-2 border-transparent aria-selected:border-current rounded-xl transition-all ease-in-out"
    >
      <span :class="!option.label && 'grow flex justify-center'">
        <slot v-bind="option" name="preview" />
      </span>
      <span class="text-md font-medium" v-if="option.label">
        {{ option.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  modelValue: any;
  options: {
    label?: string;
    value: any;
    userOptions?: any;
  }[];
}>();

defineEmits<{
  (event: "update:modelValue", value: any): void;
}>();
</script>
