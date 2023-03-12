<template>
  <div class="flex flex-col gap-3">
    <div v-if="$slots.label || $slots.description" class="flex flex-col gap-1">
      <h2
        v-if="$slots.label"
        class="text-gray-800 dark:text-gray-200 font-medium text-sm"
      >
        <slot name="label" />
      </h2>
      <p
        v-if="$slots.description"
        class="text-sm text-gray-700 dark:text-gray-300"
      >
        <slot name="description" />
      </p>
    </div>
    <slot />
  </div>
</template>
