<template>
  <component
    :is="$attrs.href ? 'a' : $attrs.to ? 'RouterLink' : 'button'"
    class="flex items-center justify-center gap-3 px-8 py-3 h-16 rounded-2xl bg-green-300 border-b-4 active:border-b-0 active:border-t-4 border-green-600 text-green-900 shadow-xl shadow-green-600/40 font-medium text-lg transition-all ease-in-out"
  >
    <slot />
  </component>
</template>
