<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="$slots.label"
      class="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      <slot name="label" />
    </label>
    <slot />
  </div>
</template>
