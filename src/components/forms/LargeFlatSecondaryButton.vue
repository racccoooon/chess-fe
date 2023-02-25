<template>
  <component
    :is="$attrs.href ? 'a' : 'button'"
    class="flex items-center justify-center gap-3 px-8 h-16 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-50 font-medium text-lg transition-all ease-in-out"
  >
    <slot />
  </component>
</template>
