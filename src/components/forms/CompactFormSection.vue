<template>
  <div class="flex flex-col gap-4">
    <div v-if="$slots.label || $slots.description" class="flex flex-col gap-2">
      <h2
        v-if="$slots.label"
        class="text-gray-900 dark:text-gray-50 font-medium"
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
    <div class="flex flex-col gap-4">
      <slot />
    </div>
  </div>
</template>
