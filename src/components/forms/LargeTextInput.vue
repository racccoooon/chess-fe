<template>
  <input
    v-model="value"
    class="w-full px-6 py-4 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-700 rounded-xl"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { syncRefs } from "@vueuse/core";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const value = ref(props.modelValue);

syncRefs(() => props.modelValue, value);

watch(value, (val) => {
  emit("update:modelValue", val);
});
</script>
