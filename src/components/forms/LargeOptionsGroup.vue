<template>
  <div class="flex flex-wrap gap-6">
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :aria-selected="modelValue === option.value"
      class="grow flex flex-row justify-between p-6 md:h-32 w-64 flex bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-4 border-transparent aria-selected:border-current rounded-xl transition-all ease-in-out"
    >
      <span class="flex flex-row gap-2 items-center">
        <SvgIcon
          type="mdi"
          :path="
            modelValue === option.value ? mdiCheckCircle : mdiCircleOutline
          "
          size="22"
        />
        <span class="text-md font-medium">{{ option.label }}</span>
      </span>
      <span class="h-full flex items-end">
        <slot v-bind="option" name="preview" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCheckCircle, mdiCircleOutline } from "@mdi/js";

defineProps<{
  modelValue: any;
  options: {
    label: string;
    value: any;
    userOptions?: any;
  }[];
}>();

defineEmits<{
  (event: "update:modelValue", value: any): void;
}>();
</script>
