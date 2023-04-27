<template>
  <component
    :is="$attrs.href ? 'a' : $attrs.to ? 'RouterLink' : 'button'"
    class="flex items-center justify-center gap-3 px-8 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 border-b-4 active:border-b-0 active:border-t-4 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-50 font-medium text-lg transition-all ease-in-out"
  >
    <slot />
  </component>
</template>
