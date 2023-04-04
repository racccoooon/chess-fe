<template>
  <component
    :is="details ? 'details' : 'div'"
    class="group/form-section dark-gray-300"
    :class="{
      'pb-8 border-b-2 dark:border-gray-700 last:border-none': details,
    }"
  >
    <component
      :is="details ? 'summary' : 'div'"
      v-if="$slots.label || $slots.description"
      class="cursor-pointer flex flex-row gap-2 justify-between"
      :class="{ 'group-open/form-section:mb-8': details, 'mb-4': !details }"
    >
      <span class="flex flex-col gap-2">
        <span
          v-if="$slots.label"
          class="text-lg text-gray-900 dark:text-gray-50 font-medium"
        >
          <slot name="label" />
        </span>
        <span
          v-if="$slots.description"
          class="text-sm text-gray-700 dark:text-gray-300"
        >
          <slot name="description" />
        </span>
      </span>
      <span v-if="details">
        <SvgIcon
          type="mdi"
          :path="mdiChevronDown"
          class="w-6 h-6 group-open/form-section:rotate-180"
        />
      </span>
    </component>
    <div class="flex flex-col gap-4">
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronDown } from "@mdi/js";

defineProps<{
  details?: boolean;
}>();
</script>
