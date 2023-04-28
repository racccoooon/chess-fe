<template>
  <div class="flex flex-wrap gap-6">
    <button
      v-for="(option, index) in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :aria-selected="modelValue === option.value"
      class="grow flex flex-row justify-between p-6 md:h-32 w-64 flex bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-4 border-transparent aria-selected:border-current rounded-xl transition-all ease-in-out"
      :class="{ 'w-3/5': index === 0 && firstBig }"
    >
      <span class="flex flex-row gap-2 items-start">
        <SvgIcon
          type="mdi"
          :path="
            modelValue === option.value ? mdiCheckCircle : mdiCircleOutline
          "
          size="22"
          class="relative top-0.5"
        />
        <span class="flex flex-col gap-2 items-start">
          <span class="text-md font-medium">{{ option.label }}</span>
          <span
            class="text-sm text-gray-500 text-left"
            v-if="option.description"
            >{{ option.description }}</span
          >
        </span>
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
    description?: string;
    value: any;
    userOptions?: any;
  }[];
  firstBig?: boolean;
}>();

defineEmits<{
  (event: "update:modelValue", value: any): void;
}>();
</script>
