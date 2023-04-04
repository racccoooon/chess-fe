<template>
  <details
    class="group/form-section pb-8 border-b-2 dark-gray-300 dark:border-gray-700 last:border-none"
  >
    <summary
      v-if="$slots.label || $slots.description"
      class="group-open/form-section:mb-8 cursor-pointer flex flex-row gap-2 justify-between"
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
      <span>
        <SvgIcon
          type="mdi"
          :path="mdiChevronDown"
          class="w-6 h-6 group-open/form-section:rotate-180"
        />
      </span>
    </summary>
    <div class="flex flex-col gap-4">
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronDown } from "@mdi/js";
</script>
