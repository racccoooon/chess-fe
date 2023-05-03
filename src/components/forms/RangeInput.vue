<template>
  <div class="h-8 mt-6 relative flex flex-col justify-center">
    <div class="absolute w-full top-1">
      <span
        v-for="label in labels"
        :key="label.value"
        class="absolute"
        :style="{ left: `${((label.value - min) / (max - min)) * 100}%` }"
      >
        <span
          class="h-20 border-l-2 border-gray-400 dark:border-gray-600 hidden"
        />
        <span
          v-if="value === label.value"
          v-text="label.label"
          class="relative -left-1/2 bottom-8 text-sm text-gray-500 dark:text-gray-400 select-none"
        />
      </span>
    </div>
    <input
      type="range"
      v-model.number="value"
      v-bind="$attrs"
      :min="min"
      :max="max"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, watch } from "vue";
import { syncRefs } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    labels: {
      value: number;
      label?: string;
    }[];
  }>(),
  {
    min: 0,
    max: 100,
  }
);

defineComponent({
  inheritAttrs: false,
});

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
}>();

const value = ref(props.modelValue);

syncRefs(() => props.modelValue, value);

watch(value, (val) => {
  emit("update:modelValue", val);
});
</script>

<style scoped>
input[type="range"] {
  @apply rounded-full overflow-hidden appearance-none bg-transparent border-2 border-gray-200 dark:border-gray-700 h-8 w-full;
}

input[type="range"]::-webkit-slider-thumb {
  @apply w-4 h-4 appearance-none cursor-w-resize bg-gray-400 dark:bg-gray-100 rounded-full shadow-gray-700;
  /*noinspection CssUnresolvedCustomProperty*/
  box-shadow: -405px 0 0 400px var(--tw-shadow-color);
}
</style>
